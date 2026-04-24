import { useEffect, useState } from "react";
import { adminApi } from "@/api/admin";

export function UsersAdmin() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadUsers = async () => {
        try {
            const data = await adminApi.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const toggleRole = async (id: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        try {
            await adminApi.updateUserRole(id, newRole);
            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminApi.deleteUser(id);
            setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="text-white">Loading users...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Users Management</h1>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-neutral-800 text-neutral-400">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700/50">
                        {users.map((user) => (
                            <tr key={user._id} className="text-neutral-200">
                                <td className="p-4 font-medium">{user.fullName}</td>
                                <td className="p-4 text-neutral-400">{user.email}</td>
                                <td className="p-4">
                                    <span className={"px-3 py-1 rounded-full text-xs font-medium " + (user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-neutral-700 text-neutral-300')}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-3">
                                    <button 
                                        onClick={() => toggleRole(user._id, user.role || 'user')}
                                        className="text-sm text-teal-400 hover:text-teal-300"
                                    >
                                        Toggle Role
                                    </button>
                                    <button 
                                        onClick={() => deleteUser(user._id)}
                                        className="text-sm text-rose-400 hover:text-rose-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-neutral-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
