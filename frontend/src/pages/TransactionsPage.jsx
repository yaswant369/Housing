import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function TransactionsPage() {
  const navigate = useNavigate();
  const { API_URL, token, currentUser } = useContext(AppContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    } else {
      navigate('/login');
    }
  }, [page, currentUser]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/subscription/transactions?page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle size={20} className="text-green-400" />;
      case 'failed': return <XCircle size={20} className="text-red-400" />;
      case 'pending': return <Clock size={20} className="text-yellow-400" />;
      case 'refunded': return <RefreshCw size={20} className="text-blue-400" />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'refunded': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Transaction History</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Receipt size={64} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
            <p className="text-gray-400 mb-6">Purchase a premium plan to get started</p>
            <button
              onClick={() => navigate('/premium')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700"
            >
              View Plans
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.transactionId} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <div className="ml-3">
                        <h3 className="font-bold text-lg">{transaction.planDetails?.planName || 'Premium Plan'}</h3>
                        <p className="text-sm text-gray-400">{new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(transaction.status)}`}>
                      {transaction.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Transaction ID</p>
                      <p className="font-mono">{transaction.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Payment Method</p>
                      <p className="capitalize">{transaction.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="font-bold text-lg">₹{transaction.totalAmount}</p>
                    </div>
                    {transaction.planDetails && (
                      <div>
                        <p className="text-gray-400">Contacts</p>
                        <p>{transaction.planDetails.contactsAllowed === 999999 ? 'Unlimited' : transaction.planDetails.contactsAllowed}</p>
                      </div>
                    )}
                  </div>

                  {transaction.failureReason && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                      <p className="text-sm text-red-300">{transaction.failureReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-800 rounded-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
