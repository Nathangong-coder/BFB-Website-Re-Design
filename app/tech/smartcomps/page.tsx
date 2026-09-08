"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, AlertCircle, Play, Sparkles, ChevronDown, Check, X, Shield, FileText, Loader2 } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

// The full tool is implemented but hidden behind a "Coming Soon" placeholder
// below while it's still being tuned. Swap the default export back to
// SmartCompsTool to re-enable it.
export default function SmartCompsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-midnight">
      <section className="relative flex-1 flex flex-col items-center justify-center pt-page pb-section px-gutter text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-50 dark:bg-midnight" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4"
          >
            <div className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <Sparkles className="text-bfb-blue" size={28} />
            </div>
            <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue">
              Proprietary Tech
            </span>
            <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">
              smartComps Valuator
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />
            <p className="italic font-light text-slate-400 dark:text-silver/40 text-body-lg leading-relaxed">
              A hybrid quantitative valuation engine fusing standard financial multiples with high-dimensional qualitative NLP embeddings from company summaries.
            </p>
            <div className="flex items-center gap-3 text-slate-400 font-medium italic">
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
              Coming soon
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

interface ConfigData {
  financial_features: string[];
  categorical_features: string[];
  targets: string[];
  nlp_features: string[];
  sector_options: string[];
}

interface ValuationMetrics {
  mdape: number;
  r2: number;
  mae?: number;
  mape?: number;
}

interface PredictionResult {
  valuation: string;
  valuation_range: string;
}

// Not currently rendered — kept here so the tool can be flipped back on
// by exporting this instead of the placeholder above.
export function SmartCompsTool() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("enterprise_value");
  
  // States for loading/training
  const [isConfigExpanded, setIsConfigExpanded] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainStatus, setTrainStatus] = useState<string>("");
  const [metrics, setMetrics] = useState<ValuationMetrics | null>(null);
  const [trained, setTrained] = useState<boolean>(false);
  
  // Prediction inputs
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [businessSummary, setBusinessSummary] = useState<string>("");
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  // Connection error
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState<boolean>(true);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<"about" | "terms" | "privacy" | null>(null);

  // Helper to map technical names to display labels
  const getDisplayLabel = (feature: string) => {
    const mapping: Record<string, string> = {
      estimated_revenue: "Revenue (TTM)",
      ebitda: "EBITDA (TTM)",
      total_cash: "Total Cash",
      total_debt: "Total Debt",
      forwardPE: "Forward P/E",
      ev_to_ebitda: "EV / EBITDA",
      enterprise_value: "Enterprise Value",
      employee_count: "Employee Count",
      sector: "Sector",
      business_summary: "Business Summary",
    };
    return mapping[feature] || feature.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  // Fetch configuration on load
  const loadConfig = async () => {
    try {
      setConnectionError(null);
      setIsConfigLoading(true);
      const res = await fetch("/api/smartcomps/config");
      if (!res.ok) {
        throw new Error("Failed to fetch configuration");
      }
      const data: ConfigData = await res.json();
      setConfig(data);
      
      // Auto-select all features by default
      const allFeatures = [
        ...data.financial_features,
        ...data.categorical_features,
        ...data.nlp_features,
      ];
      setSelectedFeatures(allFeatures);
      
      // Select default target
      if (data.targets.includes("enterprise_value")) {
        setTarget("enterprise_value");
      } else if (data.targets.length > 0) {
        setTarget(data.targets[0]);
      }
    } catch (err) {
      console.error(err);
      setConnectionError("Could not connect to the smartComps valuation backend. Please check that the server is running.");
    } finally {
      setIsConfigLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Handle Feature Checkbox Change
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Run Training Pipeline
  const handleTrain = async () => {
    if (selectedFeatures.includes(target)) {
      setTrainStatus(`Error: Target variable ("${getDisplayLabel(target)}") cannot be selected as an input feature.`);
      return;
    }

    setIsTraining(true);
    setIsConfigExpanded(false); // Collapse the form so the loading panel is front and center
    setTrainStatus("Initializing valuation engine and tuning model hyperparameters...");
    setPredictionResult(null);
    setPredictionError(null);

    try {
      const res = await fetch("/api/smartcomps/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          features: selectedFeatures,
          target: target,
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        setMetrics(result.metrics);
        setTrained(true);
        setTrainStatus("Valuation engine ready.");

        // Initialize input state for selected features (excluding NLP business summary)
        const initialInputs: Record<string, string> = {};
        selectedFeatures.forEach(feat => {
          if (feat !== "business_summary") {
            initialInputs[feat] = "";
          }
        });
        setInputs(initialInputs);
      } else {
        setTrainStatus(`Error: ${result.message || "Failed to train model."}`);
      }
    } catch (err) {
      setTrainStatus("Error: Lost connection to the backend server while training. Training large feature sets can take several minutes — please try again.");
    } finally {
      setIsTraining(false);
    }
  };

  // Handle Input Change
  const handleInputChange = (feature: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [feature]: value,
    }));
  };

  // Check if prediction is allowed
  const canPredict = () => {
    if (!trained) return false;
    const allInputsFilled = Object.entries(inputs).every(([feat, val]) => {
      return val.trim() !== "";
    });
    const summaryFilled = businessSummary.trim().length > 10;
    return allInputsFilled && summaryFilled;
  };

  // Run Prediction
  const handlePredict = async () => {
    if (!canPredict()) return;

    setIsPredicting(true);
    setPredictionResult(null);
    setPredictionError(null);

    // Prepare payload
    const payload: Record<string, string | number> = {
      business_summary: businessSummary.trim(),
    };

    Object.entries(inputs).forEach(([feat, val]) => {
      const isFinancial = config?.financial_features.includes(feat);
      payload[feat] = isFinancial ? parseFloat(val) : val;
    });

    try {
      const res = await fetch("/api/smartcomps/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        setPredictionResult({
          valuation: result.valuation,
          valuation_range: result.valuation_range,
        });
      } else {
        setPredictionError(result.message || "Failed to generate prediction.");
      }
    } catch (err) {
      setPredictionError("Connection error while calling the valuation model.");
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-midnight pt-page pb-section px-gutter overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <span className="block w-full text-center text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue">
            Proprietary Tech
          </span>
          <h1 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center flex items-center justify-center gap-3">
            smartComps Valuator
            <button
              onClick={() => setActiveModal("about")}
              className="text-slate-400 hover:text-bfb-blue transition-colors cursor-pointer"
              title="Click to learn how to use this tool"
            >
              <Info size={24} />
            </button>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />
          <p className="italic font-light text-slate-400 dark:text-silver/40 text-body-lg leading-relaxed max-w-xl mx-auto">
            A hybrid quantitative valuation engine fusing standard financial multiples with high-dimensional qualitative NLP embeddings from company summaries.
          </p>
        </div>

        {/* Initial engine connection loading state */}
        {isConfigLoading && !connectionError && (
          <div className="mb-8 p-10 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-center">
            <Loader2 size={28} className="mx-auto mb-4 text-bfb-blue animate-spin" />
            <p className="text-sm font-semibold text-slate-700 dark:text-silver">Connecting to the valuation engine...</p>
            <p className="text-xs text-slate-400 dark:text-silver/40 mt-1">This can take a moment on a cold start.</p>
          </div>
        )}

        {/* Backend offline error */}
        {connectionError && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-sm flex items-start gap-3">
            <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Backend Server Offline</p>
              <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">{connectionError}</p>
              <button 
                onClick={loadConfig} 
                className="mt-3 text-xs font-semibold text-red-800 dark:text-red-300 hover:underline"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {config && (
          <div className="space-y-8">
            
            {/* Step 1: Model Setup (Accordion) */}
            <div className="bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm overflow-hidden">
              <button
                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                disabled={isTraining}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 cursor-pointer disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-bfb-blue" />
                  <span className="text-sm font-bold tracking-wider uppercase text-slate-800 dark:text-silver">
                    1. Engine Setup & Hyperparameter Training
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isConfigExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={18} className="text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isConfigExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Features Selection */}
                        <div className="md:col-span-7">
                          <h3 className="text-sm font-medium text-slate-800 dark:text-silver/80 mb-3">
                            Select Input Features
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              ...config.financial_features,
                              ...config.categorical_features,
                              ...config.nlp_features,
                            ].map(feat => (
                              <label
                                key={feat}
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/[0.01] hover:bg-slate-100 dark:hover:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 rounded-sm cursor-pointer select-none text-xs text-slate-700 dark:text-silver/80 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFeatures.includes(feat)}
                                  onChange={() => handleFeatureToggle(feat)}
                                  className="accent-bfb-blue w-4 h-4 rounded-sm"
                                />
                                {getDisplayLabel(feat)}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Target Selection & Train Action */}
                        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-800 dark:text-silver/80 mb-2">
                              Target Variable (Predictand)
                            </label>
                            <select
                              value={target}
                              onChange={e => setTarget(e.target.value)}
                              className="w-full px-3 py-2.5 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue text-sm"
                            >
                              {config.targets.map(tar => (
                                <option key={tar} value={tar} className="bg-white dark:bg-midnight">
                                  {getDisplayLabel(tar)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <button
                              onClick={handleTrain}
                              disabled={isTraining || selectedFeatures.length === 0}
                              className="w-full py-3.5 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20 text-sm flex items-center justify-center gap-2"
                            >
                              {isTraining ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Play size={14} fill="currentColor" />
                              )}
                              {isTraining ? "Training Engine..." : "Initialize & Train Engine"}
                            </button>

                            {trainStatus && (
                              <p className={`mt-3 text-xs leading-relaxed ${
                                trainStatus.startsWith("Error") 
                                  ? "text-red-500 font-semibold" 
                                  : trainStatus.startsWith("Valuation")
                                    ? "text-green-500 font-semibold"
                                    : "text-slate-400"
                              }`}>
                                {trainStatus}
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Training Loading State */}
            {isTraining && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-center max-w-xl mx-auto"
              >
                <Loader2 size={32} className="mx-auto mb-4 text-bfb-blue animate-spin" />
                <p className="text-sm font-semibold text-slate-700 dark:text-silver">Training the valuation engine...</p>
                <p className="text-xs text-slate-400 dark:text-silver/40 mt-2 max-w-sm mx-auto leading-relaxed">
                  Fitting the model and encoding business summaries can take a few minutes for larger feature sets. Please keep this tab open.
                </p>
              </motion.div>
            )}

            {/* Model Performance Metrics Panel */}
            {metrics && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 border-t-4 border-t-bfb-blue rounded-sm shadow-sm max-w-xl mx-auto"
              >
                <div 
                  className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 cursor-help"
                  title="Performance metrics calculated on a held-out test set of companies."
                >
                  Model Performance (Hold-out Test Set)
                </div>
                <div className="flex justify-around items-center">
                  <div 
                    className="text-center cursor-help"
                    title="Median Absolute Percentage Error: Lower is better. Measures the average percentage difference between the model's estimate and the true value."
                  >
                    <div className="text-h2 font-serif text-slate-800 dark:text-silver">
                      {(metrics.mdape * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-silver/40 font-bold uppercase mt-1">MDAPE</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                  <div 
                    className="text-center cursor-help"
                    title="Coefficient of Determination (R-squared): Higher is better (max 1.0). Indicates the proportion of valuation variance explained by the model features."
                  >
                    <div className="text-h2 font-serif text-slate-800 dark:text-silver">
                      {metrics.r2.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-silver/40 font-bold uppercase mt-1">R² Score</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Main Valuation Interface */}
            <div className="space-y-6">
              
              {/* Feature Inputs Grid */}
              <div className="bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
                  <span className="text-sm font-bold tracking-wider uppercase text-slate-800 dark:text-silver">
                    2. Valuation Inputs
                  </span>
                  {!trained && (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full font-bold ml-2">
                      Engine Uninitialized
                    </span>
                  )}
                </div>

                {trained ? (
                  <div className="space-y-6">
                    
                    {/* Inputs Generation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {selectedFeatures.map(feat => {
                        if (feat === "business_summary") return null;

                        const isCategorical = config.categorical_features.includes(feat);
                        const isFinancial = config.financial_features.includes(feat);
                        
                        return (
                          <div key={feat} className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-silver/80">
                              {getDisplayLabel(feat)}
                            </label>
                            {feat === "sector" ? (
                              <select
                                value={inputs[feat] || ""}
                                onChange={e => handleInputChange(feat, e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue text-sm transition-colors"
                              >
                                <option value="" disabled className="bg-white dark:bg-midnight">Choose Sector...</option>
                                {config.sector_options.map(s => (
                                  <option key={s} value={s} className="bg-white dark:bg-midnight">{s}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={isCategorical ? "text" : "number"}
                                value={inputs[feat] || ""}
                                onChange={e => handleInputChange(feat, e.target.value)}
                                placeholder={isFinancial ? "0.00" : "Enter value..."}
                                className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue text-sm transition-colors"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Qualitative Context - Business Summary */}
                    {selectedFeatures.includes("business_summary") && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-slate-700 dark:text-silver/80">
                            Qualitative Business Summary
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Required (min 10 chars)
                          </span>
                        </div>
                        <textarea
                          value={businessSummary}
                          onChange={e => setBusinessSummary(e.target.value)}
                          rows={5}
                          placeholder="Paste qualitative profile, strategy overview, or business operations description here... The NLP pipeline encodes this to find semantic peers."
                          className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue text-sm transition-colors resize-none"
                        />
                      </div>
                    )}

                    {/* Generate Button */}
                    <button
                      onClick={handlePredict}
                      disabled={isPredicting || !canPredict()}
                      className="w-full py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20 text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      {isPredicting ? "Running Valuation Models..." : "Generate Valuation Report"}
                    </button>
                    
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 dark:text-silver/40">
                    <AlertCircle size={36} className="mx-auto mb-3 text-slate-300 dark:text-white/10" />
                    <p className="text-sm">Please initialize and train the engine above to load the valuation input fields.</p>
                  </div>
                )}
              </div>

              {/* Prediction Result Display */}
              {isPredicting && (
                <div className="p-12 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-center">
                  <Loader2 size={32} className="mx-auto mb-4 text-bfb-blue animate-spin" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-silver">Running the valuation models...</p>
                  <p className="text-xs text-slate-400 dark:text-silver/40 mt-2">Evaluating financials and encoding the business description.</p>
                </div>
              )}

              {predictionError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-sm text-red-600 dark:text-red-400 text-sm">
                  {predictionError}
                </div>
              )}

              {predictionResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm p-8 text-center space-y-4"
                >
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-bfb-blue">
                    Estimated {getDisplayLabel(target)}
                  </span>
                  
                  <div className="text-hero font-serif font-bold text-slate-900 dark:text-silver">
                    {predictionResult.valuation}
                  </div>

                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-bfb-blue/40 to-transparent mx-auto my-3" />

                  <div className="text-sm text-slate-500 dark:text-silver/60 leading-relaxed max-w-md mx-auto">
                    Confidence Range (±MDAPE):{" "}
                    <span className="font-semibold text-slate-800 dark:text-silver">
                      {predictionResult.valuation_range}
                    </span>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Footer and documentation links */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 text-center text-xs text-slate-400 dark:text-silver/30 space-y-4">
              <p>
                Quantitative predictions are generated via the smartComps hybrid regression pipeline.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setActiveModal("terms")}
                  className="hover:text-bfb-blue transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
                <span>|</span>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="hover:text-bfb-blue transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </div>
              <p className="text-[10px]">
                &copy; {new Date().getFullYear()} Bruins in Finance and Banking. Built for personal educational purposes.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Modal Dialogs */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0D1323] border border-slate-200 dark:border-white/10 rounded-sm shadow-xl p-6 md:p-8 text-slate-800 dark:text-silver/90 z-10 max-h-[85vh] overflow-y-auto"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-sm transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {activeModal === "about" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Info className="text-bfb-blue" size={24} />
                    <h2 className="text-2xl font-serif text-slate-900 dark:text-silver">
                      About smartComps
                    </h2>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-white/10" />
                  
                  <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-silver/70">
                    <p>
                      <strong>smartComps</strong> is a valuation engine that uses Machine Learning to estimate company valuations. 
                      It uniquely synthesizes hard financial multiples (e.g. Revenue, EBITDA) with high-dimensional <strong>NLP (Natural Language Processing)</strong> 
                      to &ldquo;understand&rdquo; the qualitative nature of a business through its business summary.
                    </p>
                    
                    <h3 className="font-bold text-slate-850 dark:text-silver mt-6">How to Use:</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong>Engine Setup:</strong> Open the &ldquo;Engine Setup & Training&rdquo; accordion. Select the financial features you want the model to learn from and choose your target variable. 
                        Click &ldquo;Initialize & Train Engine&rdquo; to build a custom model optimized for your selection (This uses Bayesian hyperparameter search via Optuna).
                      </li>
                      <li>
                        <strong>Input Metrics:</strong> Once the engine is ready, the interface will generate fields for your selected features. 
                        Fill in the financial data for the company you wish to value.
                      </li>
                      <li>
                        <strong>Qualitative Context:</strong> Paste the company&apos;s business summary or a strategic overview into the text area. 
                        The AI uses this to identify sectoral peers and qualitative similarities in its training set.
                      </li>
                      <li>
                        <strong>Generate Report:</strong> Click &ldquo;Generate Valuation Report&rdquo; to receive a predicted valuation and a confidence range 
                        derived from the model&apos;s historical performance (MDAPE).
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {activeModal === "terms" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <FileText className="text-bfb-blue" size={24} />
                    <h2 className="text-2xl font-serif text-slate-900 dark:text-silver">
                      Terms of Service
                    </h2>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-white/10" />
                  
                  <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-silver/70">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">1. Educational & Fun Use Only</p>
                      <p>smartComps is an experimental, AI-powered tool created for personal entertainment and educational purposes. It is not intended for use in professional financial analysis, legal reporting, or investment decision-making.</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">2. No Liability</p>
                      <p>The author and developers of this project are not responsible for any actions taken by users or for any consequences (financial, legal, or otherwise) resulting from the use of this tool. Predictions are based on historical data and machine learning algorithms which may be inaccurate or outdated.</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">3. &ldquo;As-Is&rdquo; Service</p>
                      <p>This site is provided &ldquo;as-is&rdquo; without any warranties of any kind. We do not guarantee the uptime, accuracy, or reliability of the valuation engine or the data fetched from external sources.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === "privacy" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <Shield className="text-bfb-blue" size={24} />
                    <h2 className="text-2xl font-serif text-slate-900 dark:text-silver">
                      Privacy Policy
                    </h2>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-white/10" />
                  
                  <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-silver/70">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">1. Data Storage</p>
                      <p>We do not store, save, or persist the financial metrics or business summaries you input into this application in any database. All processing is done in-memory to generate the requested valuation and is cleared upon the end of your session.</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">2. User Responsibility</p>
                      <p>You are solely responsible for the information you choose to input into the site. We strongly advise against inputting confidential, proprietary, or non-public information. By using this tool, you acknowledge that you do so at your own risk.</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-silver mb-1">3. External Data</p>
                      <p>This project may utilize third-party APIs (such as YFinance) to fetch market data. We are not responsible for the privacy practices of these external services.</p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
