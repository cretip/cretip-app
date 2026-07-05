'use client';

const ActivityFeed = ({ tips, creatorName }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Tips</h3>

      {tips.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">No tips yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Be the first to tip {creatorName}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {tip.sender}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    +${tip.amount}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatTime(tip.timestamp)}
                </p>
                {tip.tx_hash && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono break-all">
                    {tip.tx_hash.substring(0, 16)}...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Total raised: <span className="text-green-600 dark:text-green-400 font-bold">
              ${tips.reduce((sum, tip) => sum + tip.amount, 0)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
