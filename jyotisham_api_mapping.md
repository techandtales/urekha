# Jyotisham API Pipeline Data Mapping

This document provides a clear mapping of all astrological data fetched from the Jyotisham API within the celestial pipeline.

## 1. Horoscope Data
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `planet_details` | `horoscope` | `/horoscope/planet-details` | `PlanetaryDetailsResponse` | `types/horoscope/palnetDetails.d.ts` |
| `ascendant_report` | `horoscope` | `/horoscope/ascendant-report` | `AscendantResponse` | `types/horoscope/ascendantReport.d.ts` |
| `divisional_chart` | `horoscope` | `/horoscope/divisonal-chart` | `ChartResponse` | `types/horoscope/divisionalChart.d.ts` |
| `ashtakvarga` | `horoscope` | `/horoscope/ashtakvarga` | `AshtakvargaResponse` | `types/horoscope/asthakVarga.d.ts` |
| `binnashtakvarga` | `horoscope` | `/horoscope/binnashtakvarga` | `BhinnashtakavargaResponse` | `types/horoscope/binnashthakVarga.d.ts` |
| `binnashtakvarga_Planet`| `horoscope` | `/horoscope/binnashtakvarga` | (Suffix: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) | |

## 2. Dasha (Time Periods)
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `dasha_current_maha` | `dasha` | `/dasha/current-mahadasha` | `CurrentMahadashaResponse` | `types/dasha/currentMahadasha.d.ts` |
| `dasha_current_maha_full`| `dasha` | `/dasha/current-mahadasha-full`| `CurrentMahadashaFullResponse`| `types/dasha/currentMahadashaFull.d.ts`|
| `dasha_maha` | `dasha` | `/dasha/mahadasha` | `MahadashaResponse` | `types/dasha/mahaDasha.d.ts` |
| `dasha_specific_sub` | `dasha` | `/dasha/specific-sub-dasha` | `SpecificSubDashaResponse` | `types/dasha/specificSubDash.d.ts` |
| `dasha_yogini_main` | `dasha` | `/dasha/yogini-dasha-main` | `YoginiDashaResponse` | `types/dasha/yoginiDasha.d.ts` |
| `dasha_yogini_sub` | `dasha` | `/dasha/yogini-dasha-sub` | `YoginiSubDashaResponse` | `types/dasha/yoginiSubDasha.d.ts` |

## 3. Dosha (Afflictions)
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `dosha_mangal` | `dosha` | `/dosha/mangal_dosh` | `MangalDoshaResponse` | `types/dosha/mangalDosha.d.ts` |
| `dosha_kaalsarp` | `dosha` | `/dosha/kaalsarp-dosh` | `KaalSarpResponse` | `types/dosha/kaalsarpDosha.d.ts` |
| `dosha_manglik` | `dosha` | `/dosha/manglik-dosh` | `ManglikAnalysisResponse` | `types/dosha/manglikDosha.d.ts` |
| `dosha_pitra` | `dosha` | `/dosha/pitra-dosh` | `PitraDoshaResponse` | `types/dosha/pitraDosha.d.ts` |

## 4. Extended Horoscope
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `extended_horoscope` | `extendedHoro` | `/extended_horoscope/extended_kundali`| `ExtendedKundliResponse`| `types/extended-horoscope/extendedKundli.d.ts`|
| `extended_current_sadesati` | `extendedHoro` | `/extended_horoscope/current_sadesati`| `SadeSatiResponse` | `types/extended-horoscope/currentSadeSati.d.ts`|
| `extended_friendship_table` | `extendedHoro` | `/extended_horoscope/friendship_table`| `FriendshipTableResponse`| `types/extended-horoscope/friendshipTable.d.ts`|
| `extended_planets_kp` | `extendedHoro` | `/extended_horoscope/planets_kp` | `PlanetKpResponse` | `types/extended-horoscope/planetKp.d.ts` |

## 5. KP Astrology
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `kp_planet_details` | `kpAstrology` | `/kp/planet_details` | `KPPlanetDetailsResponse` | `types/kpAstrology/kpPlanetDetails.d.ts`|
| `kp_cusp_details` | `kpAstrology` | `/kp/cusp_details` | `KPCuspsResponse` | `types/kpAstrology/kpCuspsDetails.d.ts`|
| `kp_planet_significators` | `kpAstrology` | `/kp/planet_signification` | `KPPlanetSignificationsResponse`|`types/kpAstrology/kpPlanetSignifications.d.ts`|
| `kp_house_significators` | `kpAstrology` | `/kp/house_significators`| `KPHouseSignificatorsResponse`|`types/kpAstrology/kpHouseSignificators.d.ts`|

## 6. Panchang (Almanac)
| Unique Name (Field) | App Category | API Endpoint URL | Interface / Type | Type Path |
|:---|:---|:---|:---|:---|
| `panchang` | `panchang` | `/panchang/panchang` | `PanchangResponse` | `types/panchang/panchang.d.ts` |
| `choghadiya_muhurta` | `panchang` | `/panchang/choghadiya-muhurta`| `ChoghadiyaResponse` | `types/panchang/choghadiya.d.ts` |
| `hora_muhurta` | `panchang` | `/panchang/hora-muhurta` | `HoraResponse` | `types/panchang/hora.d.ts` |

## 7. AI Predictions (Backend Analysis)
*Note: These are processed via the local backend (vllm/openai) using data from the sources above.*

| Unique Name | Backend Endpoint | Source Data Used |
|:---|:---|:---|
| `health` | `/predict/health` | D1 Chart + Mahadasha |
| `education` | `/predict/education` | D1 Chart + Mahadasha |
| `career` | `/predict/career` | D1 Chart + Mahadasha |
| `marriage` | `/predict/marriage` | D1 Chart + Mahadasha |
| `lifeanalysis` | `/predict/lifeanalysis` | D1 Chart + Mahadasha |

---
**Base API URL:** `https://api.jyotishamastroapi.com/api`
