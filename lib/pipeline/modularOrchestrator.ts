import { socket } from "@/lib/socketio/client";
import { useStore } from "@/lib/store";
import { JYOTISHAM_MAPPINGS, type PipelineActions, type BaseArgs } from "./constants";
import { API_BASE_URL } from "@/lib/config/api";
import { toast } from "sonner";

export class ModularOrchestrator {
  private args: BaseArgs;
  private actions: PipelineActions;
  private coolingTimerInterval: NodeJS.Timeout | null = null;

  constructor(args: BaseArgs, actions: PipelineActions) {
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
    const base = {
      date: this.args.date,
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

  public async runPhase1() {
    const store = useStore.getState();
    store.setModularPhase('jyotisham');
    this.actions.setPipelineRunning(true);

    console.log("[Orchestrator] Starting Phase 1. Base URL:", API_BASE_URL);
    if (!socket.connected) {
      console.log("[Orchestrator] Connecting socket...");
      socket.connect();
    }
    const roomId = this.args.socketRoom || `room_${Math.random().toString(36).substring(2, 9)}`;
    console.log("[Orchestrator] Joining room:", roomId);
    socket.emit("join_jyotisham", { room_id: roomId });
    await this.sleep(1000);

    // 1. Prepare Mappings (Exact copy of old logic)
    const standardMappings = JYOTISHAM_MAPPINGS.filter(m => m.slug !== "binnashtakvarga" && m.slug !== "transit_chart");
    const binnActive = JYOTISHAM_MAPPINGS.find(m => m.slug === "binnashtakvarga");
    const binnTasks: any[] = [];
    if (binnActive) {
        ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(p => {
            binnTasks.push({ ...binnActive, label: `Bhinnashtakavarga - ${p}`, extraPayload: { planet: p } });
        });
    }
    const transitMapping = JYOTISHAM_MAPPINGS.find(m => m.slug === "transit_chart");

    // 1. Fetch AI Prompt Structure First (Ported from old orchestrator)
    let prompts: any[] = [];
    if (this.args.planId) {
        this.actions.pushMessage({
            id: "fetch_prompts",
            step: "system",
            label: this.args.lang === 'hi' ? "रिपोर्ट संरचना को अंतिम रूप दिया जा रहा है..." : "Finalizing Report Structure...",
            status: "pending",
            timestamp: Date.now(),
            group: "system",
        });
        try {
            const promptRes = await fetch(`/api/predict/prompts?planId=${this.args.planId}&lang=${this.args.lang}`);
            if (promptRes.ok) {
                const resJson = await promptRes.json();
                if (resJson.success) {
                    prompts = resJson.prompts;
                    (window as any).__plannedPrompts = prompts;
                    prompts.forEach((p: any) => this.actions.setPrediction(p.slug, { status: "pending", data: "" }));
                    this.actions.updateMessage("fetch_prompts", { 
                        status: "success", 
                        label: this.args.lang === 'hi' ? "रिपोर्ट संरचना तैयार है ✓" : "Report Structure Finalized ✓" 
                    });
                }
            }
        } catch (e) { /* fallback below */ }
    }

    if (prompts.length === 0) {
        const isHi = this.args.lang === 'hi';
        prompts = [
            { slug: "personal-insight-1200", name: isHi ? "व्यक्तिगत अंतर्दृष्टि" : "Personal Insight" },
            { slug: "education-1200", name: isHi ? "शिक्षा विश्लेषण" : "Education Analysis" },
            { slug: "career-1200", name: isHi ? "करियर और पेशेवर जीवन" : "Career & Professional Journey" },
            { slug: "finance-1200", name: isHi ? "वित्त और धन प्रवाह" : "Finance & Money Flow" },
            { slug: "love-relation-1200", name: isHi ? "प्रेम, भावनाएं और संबंध" : "Love, Emotions & Relationships" },
            { slug: "family-relation-1200", name: isHi ? "परिवार और सामाजिक समर्थन" : "Family & Social Support" },
            { slug: "health-1200", name: isHi ? "स्वास्थ्य विश्लेषण" : "Health Analysis" },
            { slug: "challenges-1200", name: isHi ? "शत्रु और चुनौतियाँ" : "Enemy & Challenges" },
            { slug: "spirituality-1200", name: isHi ? "आध्यात्मिकता" : "Spirituality" },
        ];
        (window as any).__plannedPrompts = prompts;
        prompts.forEach((p: any) => this.actions.setPrediction(p.slug, { status: "pending", data: "" }));
        this.actions.pushMessage({
            id: "fetch_prompts_fallback",
            step: "system",
            status: "success",
            label: isHi ? "डिफ़ॉल्ट 1200-प्लान का उपयोग किया गया ✓" : "Default 1200-Plan Used ✓",
            timestamp: Date.now(),
            group: "system",
        });
    }

    const totalCount = standardMappings.length + binnTasks.length + (transitMapping ? 1 : 0) + prompts.length;
    const standardBatches = this.chunkArray(standardMappings, 4);
    const binnBatches = this.chunkArray(binnTasks, 4);

    console.log("[Orchestrator] Total tasks planned:", totalCount, "Prompts fetched:", prompts.length);
    console.log("[Orchestrator] Standard batches:", standardBatches.length, "Binn batches:", binnBatches.length);
    this.actions.setProgress({ total: totalCount, completed: 0 });

    let currentCompleted = 0;
    const breakPoint = Math.floor(totalCount / 2);
    let coolingDone = false;

    // 2. Process Standard Batches
    for (let i = 0; i < standardBatches.length; i++) {
        const batch = standardBatches[i];
        if (currentCompleted >= breakPoint && !coolingDone && !store.isPhase1Complete) {
            coolingDone = true;
            await this.executeCoolingBreak();
        }
        await this.processBatch(batch, `std_${i}`, roomId);
        currentCompleted += batch.length;
    }

    // 3. Process Binn Batches
    for (let i = 0; i < binnBatches.length; i++) {
        const batch = binnBatches[i];
        if (currentCompleted >= breakPoint && !coolingDone && !store.isPhase1Complete) {
            coolingDone = true;
            await this.executeCoolingBreak();
        }
        await this.processBatch(batch, `binn_${i}`, roomId);
        currentCompleted += batch.length;
    }

    // 4. Process Transit
    if (transitMapping) {
        if (currentCompleted >= breakPoint && !coolingDone && !store.isPhase1Complete) {
            coolingDone = true;
            await this.executeCoolingBreak();
        }
        await this.processBatch([transitMapping], 'transit', roomId, true);
    }

    store.setPhase1Complete(true);
    store.setModularPhase('idle');
    this.actions.setPipelineRunning(false);
  }

  private async executeCoolingBreak() {
    const store = useStore.getState();
    store.setModularPhase('cooling');
    store.setCoolingTimer(45);

    return new Promise<void>((resolve) => {
        this.coolingTimerInterval = setInterval(() => {
            const current = useStore.getState().coolingTimer;
            if (current <= 1) {
                if (this.coolingTimerInterval) clearInterval(this.coolingTimerInterval);
                store.setModularPhase('jyotisham');
                resolve();
            } else {
                store.setCoolingTimer(current - 1);
            }
        }, 1000);
    });
  }

  private async processBatch(batch: any[], batchId: string, roomId: string, isTransit = false) {
    const tasks = batch.map(b => b.extraPayload ? { task: b.slug, payload: b.extraPayload } : b.slug);
    
    batch.forEach(b => {
        const planetSuffix = b.slug === "binnashtakvarga" && b.extraPayload?.planet ? `-${b.extraPayload.planet}` : "";
        const mId = `msg-${b.slug}${planetSuffix}`;
        const existingMessages = useStore.getState().pipelineMessages;
        
        if (!existingMessages.find(m => m.id === mId)) {
            this.actions.pushMessage({
                id: mId,
                step: b.slug === "binnashtakvarga" ? `${b.slug}${planetSuffix}` : b.slug,
                label: `Fetching ${b.label}...`,
                status: "pending",
                timestamp: Date.now(),
                group: `jyotisham/${batchId}`
            });
        }
    });

    const hasSvg = batch.some(b => b.slug.startsWith("chart_image_") || b.slug.startsWith("transit_chart_") || b.slug === "transit_chart");
    const payload = this.getFinalPayload(hasSvg);

    const eventKey = isTransit ? `jyotisham_result/${roomId}/transit_chart` : `jyotisham_group_result/${roomId}/${batchId}`;
    const socketPromise = this.awaitSocketEvent(eventKey, 60000);

    try {
        const endpoint = isTransit ? 'transit_chart' : `group/${batchId}`;
        const finalUrl = `${API_BASE_URL}/jyotisham/${endpoint}`;
        console.log(`[Orchestrator] Executing fetch for batch ${batchId} to: ${finalUrl}`);
        
        await fetch(finalUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: roomId, tasks: isTransit ? undefined : tasks, payload })
        });
        console.log(`[Orchestrator] Fetch sent for ${batchId}, waiting for socket event: ${eventKey}`);

        const result = await socketPromise;
        const dataArray = isTransit ? [{ status: 'success', data: result.data || result }] : (Array.isArray(result) ? result : [result]);

        dataArray.forEach((taskRes: any, idx: number) => {
            const mapping = batch[idx];
            const planetSuffix = mapping.slug === "binnashtakvarga" && mapping.extraPayload?.planet ? `-${mapping.extraPayload.planet}` : "";
            const msgId = `msg-${mapping.slug}${planetSuffix}`;

            if (taskRes && (taskRes.status === 'success' || taskRes.success !== false)) {
                this.integrateData(mapping, taskRes.data || taskRes);
                this.actions.updateMessage(msgId, { status: 'success', label: `${mapping.label} ✓` });
                this.actions.incrementCompleted();
            } else {
                this.handleError(mapping, taskRes?.error || "Task failed", planetSuffix);
            }
        });

    } catch (err: any) {
        batch.forEach(b => {
             const planetSuffix = b.slug === "binnashtakvarga" && b.extraPayload?.planet ? `-${b.extraPayload.planet}` : "";
             this.handleError(b, "Connection Timeout", planetSuffix);
        });
    }

    // PAUSE until manual retry or success
    while (useStore.getState().pipelineErrors.length > 0) {
        await this.sleep(1000);
    }
  }

  private handleError(mapping: any, error: string, suffix: string) {
    this.actions.updateMessage(`msg-${mapping.slug}${suffix}`, { status: 'error' });
    this.actions.pushError({
        id: `err-${mapping.slug}${suffix}`,
        step: mapping.slug === "binnashtakvarga" ? `${mapping.slug}${suffix}` : mapping.slug,
        label: mapping.label,
        error: error,
        retryCount: 0,
        canRetry: true
    });
  }

  private integrateData(mapping: any, result: any) {
    const store = useStore.getState();
    if (mapping.slug === "binnashtakvarga" && mapping.extraPayload?.planet) {
        const planetName = mapping.extraPayload.planet;
        const binnData = result.response || result;
        const existing = store.jyotishamData.horoscope.binnashtakvarga as any;
        const currentResponse = existing?.response || {};
        this.actions.setJyotishamData("horoscope", {
            binnashtakvarga: { ...result, response: { ...currentResponse, [planetName]: binnData } } as any
        });
    } else if (mapping.field === "divisionalCharts" && mapping.subField) {
        const current = store.jyotishamData.horoscope.divisionalCharts || {};
        this.actions.setJyotishamData(mapping.category, { divisionalCharts: { ...current, [mapping.subField]: result } });
    } else if (mapping.field === "divisionalChartSvgs" && mapping.subField) {
        const current = store.jyotishamData.charts.divisionalChartSvgs || {};
        this.actions.setJyotishamData("charts", { divisionalChartSvgs: { ...current, [mapping.subField]: result } });
    } else {
        (this.actions.setJyotishamData as any)(mapping.category, { [mapping.field]: result });
    }
  }

  public async runPhase2(prompts: any[]) {
    const store = useStore.getState();
    store.setModularPhase('predicting');
    store.setPhase2Started(true);
    this.actions.setPipelineRunning(true);
    const roomId = store.jyotishamData.socketRoom;

    for (const p of prompts) {
        await this.executePrediction(p, roomId!);
    }
    store.setModularPhase('complete');
    this.actions.setPipelineRunning(false);
  }

  public async executePrediction(prompt: any, roomId: string, retryCount = 0) {
    const eventKey = `predict_result/${roomId}/${prompt.slug}`;
    const mId = `msg-${prompt.slug}`;
    const existingMessages = useStore.getState().pipelineMessages;

    if (!existingMessages.find(m => m.id === mId)) {
        this.actions.pushMessage({
            id: mId,
            step: prompt.slug,
            label: retryCount > 0 ? `Retrying ${prompt.name}...` : `Analyzing ${prompt.name}...`,
            status: retryCount > 0 ? "retrying" : "pending",
            timestamp: Date.now(),
            group: `predict/sequential`
        });
    }

    try {
        await fetch(`${API_BASE_URL}/predict/${prompt.slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: roomId, payload: this.getFinalPayload() })
        });
        const res = await this.awaitSocketEvent(eventKey, 180000);
        if (res && (res.success || res.status === 'success') && res.data) {
            const raw = res.data;
            let structured: any = null;
            let displayData = raw;

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
                displayData = JSON.stringify(raw);
            }

            this.actions.setPrediction(prompt.slug, { status: "success", data: displayData, structured });
            this.actions.updateMessage(`msg-${prompt.slug}`, { status: "success", label: `${prompt.name} Generated ✓` });
            this.actions.incrementCompleted();
        } else {
            throw new Error(res?.error || "Generation failed");
        }
    } catch (err: any) {
        if (retryCount < 1) {
            await this.sleep(2000);
            await this.executePrediction(prompt, roomId, retryCount + 1);
        } else {
            this.actions.setPrediction(prompt.slug, { status: "error", data: err.message });
            this.actions.updateMessage(`msg-${prompt.slug}`, { status: 'error', label: `${prompt.name} (Failed)` });
            this.actions.pushError({
                id: `err-${prompt.slug}`,
                step: prompt.slug,
                label: prompt.name,
                error: err.message,
                retryCount,
                canRetry: true
            });
            this.actions.incrementCompleted();
        }
    }
  }

  public async retryJyotishamTask(slug: string) {
      const mapping = JYOTISHAM_MAPPINGS.find(m => m.slug === slug.split('-')[0]);
      if (!mapping) return;
      const isBinn = slug.startsWith('binnashtakvarga-');
      const extraPayload = isBinn ? { planet: slug.split('-')[1] } : undefined;
      const taskObj = { ...mapping, extraPayload };
      
      this.actions.removeError(`err-${slug}`);
      this.actions.updateMessage(`msg-${slug}`, { status: 'retrying', label: `Retrying ${mapping.label}...` });
      
      const roomId = useStore.getState().jyotishamData.socketRoom;
      await this.processBatch([taskObj], `retry_${slug}`, roomId!, slug === 'transit_chart');
  }

  public async runAll() {
    await this.runPhase1();
    const prompts = (window as any).__plannedPrompts || [];
    if (prompts.length > 0) {
      await this.runPhase2(prompts);
    }
  }

  public async retryStep(stepKey: string) {
    return this.retryJyotishamTask(stepKey);
  }

  public async retryPrediction(slug: string) {
    const store = useStore.getState();
    const prompts = (window as any).__plannedPrompts || [];
    const prompt = prompts.find((p: any) => p.slug === slug);
    if (prompt) {
      const roomId = store.jyotishamData.socketRoom;
      store.removeError(`err-${slug}`);
      return this.executePrediction(prompt, roomId!);
    }
  }
}
