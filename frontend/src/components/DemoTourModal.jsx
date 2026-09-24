import React, { useState } from 'react';
import { X, Play, CheckCircle2, ChevronRight, ShieldAlert, Sparkles, Navigation, Bot, Building2 } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

export default function DemoTourModal({ setCurrentTab }) {
  const { 
    demoTourOpen, 
    setDemoTourOpen, 
    triggerFloodAlert, 
    shelters, 
    setSelectedShelter 
  } = useEmergency();
  const [currentStep, setCurrentStep] = useState(0);

  if (!demoTourOpen) return null;

  const tourSteps = [
    {
      step: 1,
      title: "Step 1: Admin Dispatch Control",
      instruction: "Admin opens the Crisis Dispatch panel to simulate an active disaster in the city.",
      actionLabel: "Go to Admin Dispatch",
      action: () => {
        setCurrentTab('admin');
      }
    },
    {
      step: 2,
      title: "Step 2: Trigger & Broadcast Flood Emergency",
      instruction: "Admin triggers a HIGH-SEVERITY FLOOD alert for Riverfront Sector 1-4. The system broadcasts to all citizens.",
      actionLabel: "Trigger High-Severity Flood",
      action: async () => {
        await triggerFloodAlert();
        setCurrentTab('dashboard');
      }
    },
    {
      step: 3,
      title: "Step 3: Citizen Alert & Immediate Instructions",
      instruction: "Citizen Dashboard receives the urgent broadcast. Citizen reviews life-safety rules (cut main breaker, pack 72h go-bag).",
      actionLabel: "Review Citizen Dashboard",
      action: () => {
        setCurrentTab('dashboard');
      }
    },
    {
      step: 4,
      title: "Step 4: Shelter Discovery & Capacity",
      instruction: "Citizen clicks 'Find Shelter'. Displays high-elevation shelters, available slots, and medical/food facilities.",
      actionLabel: "Open Shelter Discovery",
      action: () => {
        setCurrentTab('shelters');
      }
    },
    {
      step: 5,
      title: "Step 5: Select Destination & View Safe Route",
      instruction: "Citizen selects North Ridge High School (safe elevated ridge) and opens the evacuation map bypassing flood zones.",
      actionLabel: "Evacuate to North Ridge",
      action: () => {
        const northRidge = shelters.find(s => s.name.includes('North Ridge')) || shelters[0];
        if (northRidge) setSelectedShelter(northRidge);
        setCurrentTab('routes');
      }
    },
    {
      step: 6,
      title: "Step 6: Consult TRAANA AI Assistant",
      instruction: "Citizen asks: 'What should I do during this flood?' TRAANA returns life-saving guidance and go-bag checklists.",
      actionLabel: "Open TRAANA AI Assistant",
      action: () => {
        setCurrentTab('assistant');
      }
    },
    {
      step: 7,
      title: "Step 7: Access Emergency & Medical Resources",
      instruction: "Citizen checks standby trauma centers, NDRF flood relief boats, and emergency helpline dial links.",
      actionLabel: "View Emergency Resources",
      action: () => {
        setCurrentTab('resources');
      }
    }
  ];

  const handleNext = async () => {
    const action = tourSteps[currentStep].action;
    if (action) await action();
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setDemoTourOpen(false);
      setCurrentStep(0);
    }
  };

  const stepData = tourSteps[currentStep];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border-2 border-amber-500 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-amber-600 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Sparkles size={18} />
          <span>Interactive 7-Step Demo Guide</span>
        </div>
        <button 
          onClick={() => setDemoTourOpen(false)}
          className="p-1 hover:bg-amber-700 rounded-lg text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Step {currentStep + 1} of {tourSteps.length}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {Math.round(((currentStep + 1) / tourSteps.length) * 100)}% Complete
          </span>
        </div>

        <div>
          <h4 className="font-bold text-white text-base">{stepData.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{stepData.instruction}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-1.5 py-1">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx <= currentStep ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={() => setDemoTourOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Close Guide
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
          >
            <span>{stepData.actionLabel}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
