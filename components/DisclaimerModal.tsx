import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2.5 bg-rose-100 rounded-xl flex-shrink-0 mt-0.5">
              <AlertCircle size={20} className="text-rose-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Important Disclaimer</h2>
              <p className="text-xs text-slate-500 mt-1">Academic Proof-of-Concept</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Not Medical */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Not a Medical Tool</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              MindTrack is an academic Proof-of-Concept (POC) system designed for research and educational
              purposes only. <strong>It is not a medical device or diagnostic tool.</strong>
            </p>
          </section>

          {/* Simulated Data */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Simulated Data</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              All sensor data (sleep, biometrics, voice, facial) are <strong>simulated for demonstration.</strong> No real sensors are connected, and no real personal health data is collected.
            </p>
          </section>

          {/* Not a Diagnosis */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Not a Diagnosis</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              The "burnout risk" scores and recommendations are <strong>illustrative only</strong> and
              should not be considered medical advice or a diagnosis.
            </p>
          </section>

          {/* For Educational Use */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Academic Use Only</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              This system demonstrates AI reasoning techniques including:
            </p>
            <ul className="text-sm text-slate-700 leading-relaxed mt-2 space-y-1 ml-4">
              <li>• PEAS (Performance, Environment, Actuators, Sensors) mapping</li>
              <li>• Explainable AI with knowledge-based rules</li>
              <li>• Deterministic state-space reasoning</li>
              <li>• Weighted sensor fusion (CHI calculation)</li>
            </ul>
          </section>

          {/* No Real Health Data */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-900 font-semibold">
              ⚠️ If you are experiencing actual burnout or mental health concerns, please consult a qualified
              healthcare professional.
            </p>
          </section>

          {/* Accessibility */}
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Accessibility</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              This interface includes accessibility features such as ARIA labels, keyboard navigation, and
              color contrast compliance for inclusive design.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-teal-600 text-white font-semibold rounded-2xl hover:bg-teal-700 transition-colors"
          >
            I Understand — Continue
          </button>
          <p className="text-xs text-slate-500 text-center mt-4">
            You can view this disclaimer again in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
