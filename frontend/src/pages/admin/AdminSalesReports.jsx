import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDate } from '../../utils/format';

const AdminSalesReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const load = (params = {}) => {
    setLoading(true);
    adminService.getSalesReport(params).then((res) => setReport(res)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    load(dateRange);
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Sales Reports</h1>

      <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3 mb-8">
        <div>
          <label className="text-xs text-ink/50 block mb-1">Start Date</label>
          <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage bg-white" />
        </div>
        <div>
          <label className="text-xs text-ink/50 block mb-1">End Date</label>
          <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage bg-white" />
        </div>
        <button type="submit" className="btn-secondary text-sm px-5 py-2">Apply Filter</button>
      </form>

      {loading || !report ? (
        <p className="text-sm text-ink/50">Loading report…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <p className="text-sm text-ink/50 mb-1">Total Revenue</p>
              <p className="font-display text-2xl">{formatPrice(report.totals.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <p className="text-sm text-ink/50 mb-1">Total Orders</p>
              <p className="font-display text-2xl">{report.totals.totalOrders}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <p className="text-sm text-ink/50 mb-1">Avg. Order Value</p>
              <p className="font-display text-2xl">{formatPrice(report.totals.avgOrderValue)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-medium mb-4">Daily Breakdown</h2>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/50 border-b border-ink/10">
                      <th className="py-2">Date</th>
                      <th className="py-2">Orders</th>
                      <th className="py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.report.map((r) => (
                      <tr key={r._id} className="border-b border-ink/5">
                        <td className="py-2">{formatDate(r._id)}</td>
                        <td className="py-2">{r.orders}</td>
                        <td className="py-2">{formatPrice(r.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-medium mb-4">Revenue by Category</h2>
              <ul className="space-y-3">
                {report.categoryBreakdown.map((c) => (
                  <li key={c._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{c._id}</span>
                      <span>{formatPrice(c.revenue)}</span>
                    </div>
                    <div className="h-2 bg-blush/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage rounded-full"
                        style={{
                          width: `${Math.min(100, (c.revenue / (report.categoryBreakdown[0]?.revenue || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSalesReports;
