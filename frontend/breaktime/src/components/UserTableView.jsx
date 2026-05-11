import { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { apiCall } from "../utils/general";

const tableStyles = {
    table: {
        style: { backgroundColor: '#F0F7F2', fontFamily: 'Poppins, sans-serif' },
    },
    headRow: {
        style: { backgroundColor: '#F0F7F2', borderBottomColor: '#e5e7eb', minHeight: '44px' },
    },
    headCells: {
        style: { color: '#6b7280', fontWeight: '600', fontSize: '13px', fontFamily: 'Poppins, sans-serif' },
    },
    rows: {
        style: {
            backgroundColor: '#F0F7F2',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#262445',
            minHeight: '52px',
            borderBottomColor: '#f3f4f6',
        },
        highlightOnHoverStyle: { backgroundColor: '#E5EDE7', transitionDuration: '0.15s' },
    },
    noData: {
        style: { backgroundColor: '#F0F7F2', color: '#9ca3af', fontFamily: 'Poppins, sans-serif', padding: '48px 0' },
    },
};

const MODAL_COPY = {
    approve: {
        title: 'Approve Account',
        body: (username) => <>Are you sure you want to <span className="font-semibold text-dark-navy">approve</span> the account for <span className="font-semibold text-dark-navy">{username}</span>? They will be able to log in immediately.</>,
        confirmLabel: 'Approve',
        confirmClass: 'bg-dark-purple hover:bg-indigo-purple',
    },
    deny: {
        title: 'Deny Account',
        body: (username) => <>Are you sure you want to <span className="font-semibold text-dot-red">deny</span> the account for <span className="font-semibold text-dark-navy">{username}</span>? This will permanently delete their account.</>,
        confirmLabel: 'Deny',
        confirmClass: 'bg-dot-red hover:opacity-90',
    },
    delete: {
        title: 'Delete Account',
        body: (username) => <>Are you sure you want to <span className="font-semibold text-dot-red">delete</span> the account for <span className="font-semibold text-dark-navy">{username}</span>? This action cannot be undone.</>,
        confirmLabel: 'Delete',
        confirmClass: 'bg-dot-red hover:opacity-90',
    },
};

function ConfirmModal({ confirm, onConfirm, onCancel }) {
    if (!confirm) return null;
    const copy = MODAL_COPY[confirm.action];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-all">
            <div className="bg-staff-main-comp-bg rounded-2xl shadow-xl px-8 py-7 w-[360px] flex flex-col gap-4">
                <h2 className="text-xl font-bold text-dark-navy">{copy.title}</h2>
                <p className="text-sm text-gray-600">{copy.body(confirm.displayName)}</p>
                <div className="flex gap-3 justify-end pt-1">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-300 hover:bg-staff-main-comp-hover cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-colors ${copy.confirmClass}`}
                    >
                        {copy.confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TrashIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </svg>
    );
}

function ApprovalActions({ onApprove, onDeny }) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={e => { e.stopPropagation(); onApprove(); }}
                className="text-sm underline font-semibold text-dark-navy cursor-pointer"
            >
                Approve
            </button>
            <button
                onClick={e => { e.stopPropagation(); onDeny(); }}
                className="text-sm underline text-dot-red cursor-pointer"
            >
                Deny
            </button>
        </div>
    );
}

export default function UserTableView() {
    const [roleTab, setRoleTab] = useState('ya');
    const [statusFilter, setStatusFilter] = useState('all');
    const [yaUsers, setYaUsers] = useState([]);
    const [staffUsers, setStaffUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirm, setConfirm] = useState(null); // { action: 'approve'|'deny', username }

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiCall('/admin/accounts', 'GET', null, null);
            setYaUsers(data.yaUsers || []);
            setStaffUsers(data.staffUsers || []);
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
            setError('Could not load users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    const requestConfirm = (action, username, displayName) => setConfirm({ action, username, displayName: displayName ?? username });

    const handleConfirm = async () => {
        const { action, username } = confirm;
        setConfirm(null);
        try {
            if (action === 'delete') {
                await apiCall('/admin/deleteAccount', 'DELETE', { username }, null);
            } else {
                await apiCall(`/admin/${action}`, 'POST', { username }, null);
            }
            fetchAccounts();
        } catch (err) {
            console.error(`Failed to ${action} account:`, err);
        }
    };

    const deleteCol = {
        name: '',
        cell: row => (
            <button
                onClick={e => { e.stopPropagation(); requestConfirm('delete', row.username, `${row.firstName} ${row.lastName}`); }}
                className="text-gray-400 hover:text-dot-red transition-colors cursor-pointer"
                title="Delete account"
            >
                <TrashIcon />
            </button>
        ),
        width: '48px',
    };

    const yaColumns = [
        { name: 'First Name', selector: row => row.firstName, sortable: true, cell: row => <span className="font-medium">{row.firstName}</span> },
        { name: 'Last Name', selector: row => row.lastName, sortable: true },
        { name: 'Age', selector: row => row.age, sortable: true, width: '80px' },
        { name: 'Gender', selector: row => row.gender },
        { name: 'Ethnicity', selector: row => row.ethnicity },
        {
            name: '',
            cell: row => row.status === 'pending'
                ? <ApprovalActions onApprove={() => requestConfirm('approve', row.username)} onDeny={() => requestConfirm('deny', row.username)} />
                : null,
            width: '160px',
        },
        deleteCol,
    ];

    const staffColumns = [
        { name: 'First Name', selector: row => row.firstName, sortable: true, cell: row => <span className="font-medium">{row.firstName}</span> },
        { name: 'Last Name', selector: row => row.lastName, sortable: true },
        { name: 'Email', selector: row => row.email, grow: 1.5 },
        { name: 'Username', selector: row => row.username },
        {
            name: '',
            cell: row => row.status === 'pending'
                ? <ApprovalActions onApprove={() => requestConfirm('approve', row.username)} onDeny={() => requestConfirm('deny', row.username)} />
                : null,
            width: '160px',
        },
        deleteCol,
    ];

    const activeUsers = roleTab === 'ya' ? yaUsers : staffUsers;
    const pendingCount = activeUsers.filter(u => u.status === 'pending').length;
    const displayed = statusFilter === 'action'
        ? activeUsers.filter(u => u.status === 'pending')
        : activeUsers;

    const RoleTabBtn = ({ tabKey, label }) => (
        <button
            onClick={() => { setRoleTab(tabKey); setStatusFilter('all'); }}
            className={`text-sm font-medium px-4 py-1 rounded-full transition-colors cursor-pointer
                ${roleTab === tabKey ? 'bg-dark-purple text-white' : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}
        </button>
    );

    const FilterBtn = ({ filterKey, label, count }) => (
        <button
            onClick={() => setStatusFilter(filterKey)}
            className={`text-sm font-medium px-4 py-1 rounded-full transition-colors cursor-pointer
                ${statusFilter === filterKey ? 'bg-dark-purple text-white' : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}
            {count > 0 && (
                <span className="ml-2 bg-white text-dark-purple rounded-full px-1.5">{count}</span>
            )}
        </button>
    );

    return (
        <div className="bg-staff-main-comp-bg rounded-[20px] h-full flex flex-col font-all overflow-hidden">
            <ConfirmModal confirm={confirm} onConfirm={handleConfirm} onCancel={() => setConfirm(null)} />
            <div className="flex items-center gap-4 px-8 pt-8 pb-3">
                <h1 className="text-3xl font-bold text-dark-navy">Users</h1>
            </div>

            {/* Role tabs */}
            <div className="flex items-center mx-7 my-2 px-2 py-1 gap-2 border border-gray-300 rounded-full">
                <RoleTabBtn tabKey="ya" label="Young Adults" />
                <RoleTabBtn tabKey="staff" label="Staff" />
            </div>

            {/* Status filter */}
            <div className="flex items-center mx-7 mb-1 px-2 py-1 gap-1">
                <FilterBtn filterKey="all" label="All" />
                <FilterBtn filterKey="action" label="Action Required" count={pendingCount} />
            </div>

            <div className="flex-1 overflow-auto scrollbar-purple px-4">
                {error ? (
                    <p className="text-dot-red text-sm px-2 mt-4">{error}</p>
                ) : (
                    <div className="min-w-max">
                        <DataTable
                            columns={roleTab === 'ya' ? yaColumns : staffColumns}
                            data={displayed}
                            customStyles={tableStyles}
                            highlightOnHover
                            progressPending={loading}
                            noDataComponent={<p className="text-gray-400 text-sm">No users</p>}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
