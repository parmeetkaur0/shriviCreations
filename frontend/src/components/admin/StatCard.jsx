const ACCENT_CLASSES = {
  sage: { bg: 'bg-sage-50', text: 'text-sage-dark' },
  gold: { bg: 'bg-gold-light/30', text: 'text-gold-dark' },
  blush: { bg: 'bg-blush', text: 'text-ink' },
};

const StatCard = ({ label, value, icon: Icon, accent = 'sage' }) => {
  const classes = ACCENT_CLASSES[accent] || ACCENT_CLASSES.sage;
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-ink/50">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-full ${classes.bg} flex items-center justify-center`}>
            <Icon size={16} className={classes.text} strokeWidth={1.75} />
          </div>
        )}
      </div>
      <p className="font-display text-2xl text-ink">{value}</p>
    </div>
  );
};

export default StatCard;
