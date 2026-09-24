import React, { useState } from 'react';
import { MessageSquarePlus, X, Send, Star, CheckCircle2, Sparkles, Heart } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('NEW_FEATURE');
  const [suggestion, setSuggestion] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Friend / Reviewer',
          category,
          suggestion,
          rating
        })
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSuggestion('');
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40">
              <MessageSquarePlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Suggest Changes & Features</h3>
              <p className="text-xs text-slate-300">Help shape the TRAANA Disaster Response MVP</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your suggestion has been logged to the TRAANA system. The admin team can review it in the Admin Dispatch dashboard.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Name or Alias (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Alex, Rahul, Sarah..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Feedback Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="NEW_FEATURE">💡 New Feature Suggestion</option>
                  <option value="UI_UX">🎨 UI / Design & Usability</option>
                  <option value="MAP_ROUTING">🗺️ Maps & Evacuation Routes</option>
                  <option value="AI_ASSISTANT">🤖 AI Assistant & Guidance</option>
                  <option value="ACCESSIBILITY">♿ Accessibility & Language</option>
                  <option value="GENERAL">💬 General Thoughts</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  What changes or new features would you like to see?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. 'Add a pet shelter filter', 'Make the siren louder on mobile', 'Add offline SMS broadcast support'..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Overall MVP Impression</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        size={20}
                        className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-400 ml-2">({rating} / 5 stars)</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !suggestion.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition"
                >
                  <Send size={15} />
                  <span>{loading ? 'Submitting...' : 'Submit Suggestion to Dev Team'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
