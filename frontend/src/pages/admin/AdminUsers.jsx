import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../../services/adminService';
import { formatDate } from '../../utils/format';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const load = (kw = keyword) => {
    setLoading(true);
    userService.getAll({ keyword: kw, limit: 50 }).then((res) => setUsers(res.users)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleActive = async (user) => {
    try {
      await userService.update(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    load(keyword);
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Users</h1>

      <form onSubmit={handleSearch} className="max-w-sm mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full border border-ink/15 rounded-lg px-4 py-2 text-sm outline-none focus:border-sage bg-white"
        />
      </form>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-ink/5">
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-ink/60">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-gold-light/40 text-gold-dark' : 'bg-sage-50 text-sage-dark'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-ink/60">{formatDate(u.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-sage-50 text-sage-dark' : 'bg-red-100 text-red-600'}`}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleToggleActive(u)} className="text-xs text-sage-dark hover:underline">
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
