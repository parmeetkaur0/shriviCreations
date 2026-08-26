import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  idea: '',
  occasion: '',
  budget: '',
  colors: '',
  deadline: '',
};

const CustomOrder = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success('Your custom order request has been sent!');
    setForm(initialForm);
  };

  return (
    <main className="container-custom py-16 sm:py-24 bg-[#F7ECF0]">
      <div className="max-w-3xl mx-auto">
        <p className="section-eyebrow mb-3">Made especially for you</p>
        <h1 className="font-display text-4xl sm:text-6xl leading-tight mb-5">Bring your idea to life</h1>
        <p className="text-ink/65 max-w-xl leading-relaxed mb-12">
          Tell us what you are imagining and we will reply with availability, timing, and a thoughtful estimate.
        </p>

        {submitted && (
          <div className="mb-8 flex items-start gap-3 border border-sage/30 bg-sage/10 p-4 text-sm text-sage-dark">
            <Check size={18} className="mt-0.5 shrink-0" />
            <p>Thank you. We have your details and will be in touch soon.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-gray-500 rounded-lg p-6 sm:p-10 shadow-card space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="text-sm">Your name *<input required value={form.name} onChange={(event) => updateField('name', event.target.value)} className="form-input" /></label>
            <label className="text-sm">Email address *<input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className="form-input" /></label>
            <label className="text-sm">Phone number *<input required type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="form-input" /></label>
            <label className="text-sm">What is it for?<input value={form.occasion} onChange={(event) => updateField('occasion', event.target.value)} placeholder="Birthday, wedding, home..." className="form-input" /></label>
            <label className="text-sm">Approximate budget<select value={form.budget} onChange={(event) => updateField('budget', event.target.value)} className="form-input bg-white"><option value="">Choose a range</option><option>Under ₹1,000</option><option>₹1,000 - ₹2,500</option><option>₹2,500 - ₹5,000</option><option>₹5,000+</option></select></label>
            <label className="text-sm">Needed by<input type="date" value={form.deadline} onChange={(event) => updateField('deadline', event.target.value)} className="form-input" /></label>
          </div>
          <label className="text-sm block">Preferred colors or style<textarea rows={3} value={form.colors} onChange={(event) => updateField('colors', event.target.value)} placeholder="Tell us about colors, textures, or references..." className="form-input resize-none" /></label>
          <label className="text-sm block">Describe your idea *<textarea required rows={5} value={form.idea} onChange={(event) => updateField('idea', event.target.value)} placeholder="The more detail you share, the better we can help." className="form-input resize-none" /></label>
          <button type="submit" className="btn-primary inline-flex items-center gap-2 px-6 py-3">Send inquiry <ArrowRight size={16} /></button>
        </form>
      </div>
    </main>
  );
};

export default CustomOrder;
