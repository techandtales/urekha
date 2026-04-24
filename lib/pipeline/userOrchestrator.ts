import { socket } from "@/lib/socketio/client";
import { type PipelineActions, type BaseArgs, JYOTISHAM_MAPPINGS } from "./constants";
import { API_BASE_URL } from "@/lib/config/api";
import { toast } from "sonner";
import { getUserPlanConfig } from "./userPlansConfig";
import { finalizeUserReport } from "@/app/actions/report-actions";

export class UserOrchestrator {
  private args: BaseArgs & { reportId: string; planTokenCost: number };
  private actions: PipelineActions;

  // Local state storage (bypasses Zustand payload bloat)
  private localJyotishamData: Record<string, any> = {};
  private localPredictions: Record<string, any> = {};

  private coolingTimerInterval: NodeJS.Timeout | null = null;

  constructor(
    args: BaseArgs & { reportId: string; planTokenCost: number },
    actions: PipelineActions
  ) {
    this.args = args;
    this.actions = actions;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private awaitSocketEvent(eventKey: string, timeoutMs = 120000): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventKey);
        reject(new Error(`Timeout on ${eventKey}`));
      }, timeoutMs);

      socket.once(eventKey, (data: any) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) result.push(array.slice(i, i + size));
    return result;
  }

  private getFinalPayload(isSvg = false) {
    let formattedDate = this.args.date;
    if (formattedDate.includes("-")) {
        const [yyyy, mm, dd] = formattedDate.split("-");
        if (yyyy && yyyy.length === 4) {
            formattedDate = `${dd}/${mm}/${yyyy}`;
        }
    }

    const base = {
      date: formattedDate,
      time: this.args.time,
      latitude: this.args.latitude,
      longitude: this.args.longitude,
      tz: this.args.tz,
      lang: this.args.lang,
    };

    if (!isSvg) return base;

    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    const todayTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

    return {
      ...base,
      style: "north",
      colored_planets: true,
      color: "#00FF94",
      transit_date: todayStr,
      transit_time: todayTime,
    };
  }

  // Integrates into private local state instead of Zustand
  private integrateLocalData(mapping: any, result: any) {
    if (mapping.slug === "binnashtakvarga" && mapping.extraPayload?.planet) {
      const planetName = mapping.extraPayload.planet;
      const binnData = result.response || result;
      
      if (!this.localJyotishamData.horoscope) this.localJyotishamData.horoscope = {};
      const existing = this.localJyotishamData.horoscope.binnashtakvarga || {};
      const currentResponse = existing.response || {};
      
      this.localJyotishamData.horoscope.binnashtakvarga = {
        ...result,
        response: { ...currentResponse, [planetName]: binnData }
      };
    } else if (mapping.field === "divisionalCharts" && mapping.subField) {
      if (!this.localJyotishamData[mapping.category]) this.localJyotishamData[mapping.category] = {};
      const current = this.localJyotishamData[mapping.category].divisionalCharts || {};
      this.localJyotishamData[mapping.category].divisionalCharts = { ...current, [mapping.subField]: result };
    } else if (mapping.field === "divisionalChartSvgs" && mapping.subField) {
      if (!this.localJyotishamData.charts) this.localJyotishamData.charts = {};
      const current = this.localJyotishamData.charts.divisionalChartSvgs || {};
      this.localJyotishamData.charts.divisionalChartSvgs = { ...current, [mapping.subField]: result };
    } else {
      if (!this.localJyotishamData[mapping.category]) this.localJyotishamData[mapping.category] = {};
      this.localJyotishamData[mapping.category][mapping.field] = result;
    }
  }

  public async runPhase1() {
    this.actions.setPipelineRunning(true);
    const store = (await import("@/lib/store")).useStore.getState();
    store.setModularPhase('jyotisham');

    if (!socket.connected) socket.connect();
    const roomId = this.args.socketRoom || `user_room_${Math.random().toString(36).substring(2, 9)}`;
    
    // Join namespaces
    socket.emit("join_jyotisham", { room_id: roomId });
    socket.emit("join_predict", { room_id: roomId });
    await this.sleep(1000);

    const config = getUserPlanConfig(this.args.planTokenCost);
    const mappingsToRun = JYOTISHAM_MAPPINGS.filter(m => config.jyotishamSlugs.includes(m.slug));
    
    // Make prompts globally available for Phase 2 UI access
    (window as any).__plannedPrompts = config.prompts;

    const standardMappings = mappingsToRun.filter(m => m.slug !== "binnashtakvarga" && m.slug !== "transit_chart");
    const binnActive = mappingsToRun.find(m => m.slug === "binnashtakvarga");
    const binnTasks: any[] = [];
    if (binnActive) {
      ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(p => {
          binnTasks.push({ ...binnActive, label: `Bhinnashtakavarga - ${p}`, extraPayload: { planet: p } });
      });
    }
    const transitMapping = mappingsToRun.find(m => m.slug === "transit_chart");

    const totalCount = standardMappings.length + binnTasks.length + (transitMapping ? 1 : 0) + config.prompts.length;
    this.actions.setProgress({ total: totalCount, completed: 0 });

    const standardBatches = this.chunkArray(standardMappings, 4);
    const binnBatches = this.chunkArray(binnTasks, 4);

    let globalBatchIdx = 0;

    for (let i = 0; i < standardBatches.length; i++) {
        await this.processBatch(standardBatches[i], `batch_${globalBatchIdx++}`, roomId);
    }

    for (let i = 0; i < binnBatches.length; i++) {
        await this.sleep(3000); 
        await this.processBatch(binnBatches[i], `batch_${globalBatchIdx++}`, roomId);
    }

    if (transitMapping) {
        await this.processBatch([transitMapping], 'transit_chart', roomId, true);
    }

    store.setPhase1Complete(true);
    store.setModularPhase('idle');
    this.actions.setPipelineRunning(false);
  }

  public async runPhase2(prompts: any[]) {
    this.actions.setPipelineRunning(true);
    const store = (await import("@/lib/store")).useStore.getState();
    store.setModularPhase('predicting');
    store.setPhase2Started(true);

    const roomId = this.args.socketRoom;
    for (const p of prompts) {
        await this.executePrediction(p, roomId!);
    }

    // Finalize DB Storage
    this.actions.pushMessage({
        id: "msg-db-save",
        step: "db-save",
        label: "Securing Results in Database...",
        status: "pending",
        timestamp: Date.now(),
        group: "system"
    });

    try {
        const res = await finalizeUserReport(
            this.args.reportId,
            this.localJyotishamData,
            this.localPredictions
        );
        if (res.success) {
            this.actions.updateMessage("msg-db-save", { status: 'success', label: "Results Secured ✓" });
        } else {
            throw new Error(res.error || "Failed to finalize report in DB");
        }
    } catch (e: any) {
        toast.error("Error storing report: " + e.message);
        this.actions.updateMessage("msg-db-save", { status: 'error', label: "DB Storage Failed" });
    }

    store.setModularPhase('complete');
    this.actions.setPipelineRunning(false);
  }

  private async processBatch(batch: any[], batchId: string, roomId: string, isTransit = false) {
    const tasks = batch.map(b => b.extraPayload ? { task: b.slug, payload: b.extraPayload } : b.slug);
    
    batch.forEach(b => {
        const planetSuffix = b.slug === "binnashtakvarga" && b.extraPayload?.planet ? `-${b.extraPayload.planet}` : "";
        const mId = `msg-${b.slug}${planetSuffix}`;
        
        this.actions.pushMessage({
            id: mId,
            step: b.slug === "binnashtakvarga" ? `${b.slug}${planetSuffix}` : b.slug,
            label: `Fetching ${b.label}...`,
            status: "pending",
            timestamp: Date.now(),
            group: `jyotisham/${batchId}`
        });
    });

    const hasSvg = batch.some(b => b.slug.startsWith("chart_image_") || b.slug.startsWith("transit_chart_") || b.slug === "transit_chart");
    const payload = this.getFinalPayload(hasSvg);

    const eventKey = isTransit ? `jyotisham_result/${roomId}/transit_chart` : `jyotisham_group_result/${roomId}/${batchId}`;
    
    let socketError: Error | null = null;
    const socketPromise = this.awaitSocketEvent(eventKey, 60000).catch(e => {
        socketError = e;
        return null;
    });

    try {
        const endpoint = isTransit ? 'transit_chart' : `group/${batchId}`;
        
        try {
            const response = await fetch(`${API_BASE_URL}/jyotisham/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room: roomId, tasks: isTransit ? undefined : tasks, payload })
            });
            if (!response.ok) {
                console.error(`[UserOrchestrator] Fetch Failed HTTP ${response.status}: ${response.statusText}`, await response.text());
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (fetchErr) {
            console.error("[UserOrchestrator] Network/Fetch Error:", fetchErr);
            throw fetchErr; // Triggers UI fallback
        }

        const result = await socketPromise;
        if (socketError || !result) {
            throw socketError || new Error("Execution Timeout");
        }
        const dataArray = isTransit ? [{ status: 'success', data: result.data || result }] : (Array.isArray(result) ? result : [result]);

        dataArray.forEach((taskRes: any, idx: number) => {
            const mapping = batch[idx];
            const planetSuffix = mapping.slug === "binnashtakvarga" && mapping.extraPayload?.planet ? `-${mapping.extraPayload.planet}` : "";
            const msgId = `msg-${mapping.slug}${planetSuffix}`;

            if (taskRes && (taskRes.status === 'success' || taskRes.success !== false)) {
                this.integrateLocalData(mapping, taskRes.data || taskRes);
                this.actions.updateMessage(msgId, { status: 'success', label: `${mapping.label} ✓` });
            } else {
                this.actions.updateMessage(msgId, { status: 'error', label: `${mapping.label} ✗` });
            }
            this.actions.incrementCompleted();
        });

    } catch (err: any) {
        toast.error(`Timeout fetching batch. Retrying or moving on.`);
        batch.forEach(b => {
             const planetSuffix = b.slug === "binnashtakvarga" && b.extraPayload?.planet ? `-${b.extraPayload.planet}` : "";
             this.actions.updateMessage(`msg-${b.slug}${planetSuffix}`, { status: 'error', label: `${b.label} ✗ Timeout` });
             this.actions.incrementCompleted();
        });
    }
  }

  public async retryJyotishamTask(slug: string) {
    const roomId = this.args.socketRoom;
    if (!roomId) return;
    
    let binnPlanet = "";
    let baseSlug = slug;
    
    if (slug.startsWith("binnashtakvarga-")) {
        baseSlug = "binnashtakvarga";
        binnPlanet = slug.split("-")[1];
    }
    
    let mapping = JYOTISHAM_MAPPINGS.find(m => m.slug === baseSlug);
    if (!mapping) return;
    
    if (binnPlanet) {
        mapping = { ...mapping, label: `Bhinnashtakavarga - ${binnPlanet}`, extraPayload: { planet: binnPlanet } };
    }

    const batchId = `retry_${slug}_${Date.now()}`;
    const batch = [mapping];
    const isTransit = mapping.slug === "transit_chart";

    this.actions.updateMessage(`msg-${slug}`, { status: "pending", label: `Retrying ${mapping.label}...` });
    this.actions.removeError(`err-${slug}`);

    const tasks = batch.map((b: any) => b.extraPayload ? { task: b.slug, payload: b.extraPayload } : b.slug);
    const hasSvg = batch.some((b: any) => b.slug.startsWith("chart_image_") || b.slug.startsWith("transit_chart_") || b.slug === "transit_chart");
    const payload = this.getFinalPayload(hasSvg);

    const eventKey = isTransit ? `jyotisham_result/${roomId}/transit_chart` : `jyotisham_group_result/${roomId}/${batchId}`;
    
    let socketError: Error | null = null;
    const socketPromise = this.awaitSocketEvent(eventKey, 60000).catch(e => {
        socketError = e;
        return null;
    });

    try {
        const endpoint = isTransit ? 'transit_chart' : `group/${batchId}`;
        await fetch(`${API_BASE_URL}/jyotisham/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: roomId, tasks: isTransit ? undefined : tasks, payload })
        });

        const result = await socketPromise;
        if (socketError || !result) {
            throw socketError || new Error("Execution Timeout");
        }
        const dataArray = isTransit ? [{ status: 'success', data: result.data || result }] : (Array.isArray(result) ? result : [result]);
        const taskRes = dataArray[0];

        if (taskRes && (taskRes.status === 'success' || taskRes.success !== false)) {
            this.integrateLocalData(mapping, taskRes.data || taskRes);
            this.actions.updateMessage(`msg-${slug}`, { status: 'success', label: `${mapping.label} ✓` });
        } else {
            this.actions.updateMessage(`msg-${slug}`, { status: 'error', label: `${mapping.label} ✗` });
        }
    } catch (err: any) {
        toast.error(`Timeout fetching ${mapping.label} data.`);
        this.actions.updateMessage(`msg-${slug}`, { status: 'error', label: `${mapping.label} ✗ Timeout` });
    }
  }

  public async executePrediction(prompt: any, roomId: string) {
    const eventKey = `predict_result/${roomId}/${prompt.slug}`;
    const mId = `msg-${prompt.slug}`;

    this.actions.pushMessage({
        id: mId,
        step: prompt.slug,
        label: `Analyzing ${prompt.name}...`,
        status: "pending",
        timestamp: Date.now(),
        group: `predict/sequential`
    });

    try {
        try {
            const response = await fetch(`${API_BASE_URL}/predict/${prompt.slug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ room: roomId, payload: this.getFinalPayload() })
            });
            if (!response.ok) {
                console.error(`[UserOrchestrator Predict] Fetch Failed HTTP ${response.status}: ${response.statusText}`, await response.text());
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (fetchErr) {
            console.error("[UserOrchestrator Predict] Network Error:", fetchErr);
            throw fetchErr;
        }
        
        const res = await this.awaitSocketEvent(eventKey, 180000).catch(e => {
            throw e;
        });
        
        if (res && (res.success || res.status === 'success') && res.data) {
            const raw = res.data;
            let structured: any = null;

            if (typeof raw === "string") {
                try {
                    const cleaned = raw.trim();
                    const startIdx = Math.min(
                        cleaned.indexOf("{") === -1 ? Infinity : cleaned.indexOf("{"),
                        cleaned.indexOf("[") === -1 ? Infinity : cleaned.indexOf("[")
                    );
                    
                    if (startIdx !== Infinity) {
                        const potentialJson = cleaned.substring(startIdx);
                        const parsed = JSON.parse(potentialJson.replace(/```json|```/g, ""));
                        if (parsed && (Array.isArray(parsed.blocks) || parsed.blocks)) {
                            structured = parsed;
                        }
                    }
                } catch (e) { /* fallback */ }
            } else if (typeof raw === "object" && (raw.blocks || Array.isArray(raw.blocks))) {
                structured = raw;
            }

            // Store in LOCAL State, NOT Zustand
            this.localPredictions[prompt.slug] = {
                raw: raw,
                structured: structured
            };

            this.actions.updateMessage(mId, { status: "success", label: `${prompt.name} Generated ✓` });
            this.actions.incrementCompleted();
        } else {
            throw new Error(res?.error || "Generation failed");
        }
    } catch (err: any) {
        this.actions.updateMessage(mId, { status: 'error', label: `${prompt.name} (Failed)` });
        this.actions.incrementCompleted();
    }
  }
}
