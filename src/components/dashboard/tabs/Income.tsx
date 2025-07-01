import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { formatCurrency } from '../../../utils/format';
import { getWithdrawalHistory, getCreatorQuestions } from '../../../lib/firestore';
import { useAuth } from '../../../hooks/useAuth';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface IncomeProps {
  stats: {
    totalIncome: number;
    incomeThisMonth: number;
    incomeLastMonth: number;
  };
}

const Income: React.FC<IncomeProps> = ({ stats }) => {
  const { currentUser } = useAuth();
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [incomeWeekStart, setIncomeWeekStart] = useState(new Date());
  const [questionsWeekStart, setQuestionsWeekStart] = useState(new Date());
  const [incomeStats, setIncomeStats] = useState({
    total: 0,
    today: 0,
    thisMonth: 0,
    lastMonth: 0
  });
  const [dailyIncomeData, setDailyIncomeData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: []
  });
  const [questionsData, setQuestionsData] = useState<{
    labels: string[];
    received: number[];
    answered: number[];
  }>({
    labels: [],
    received: [],
    answered: []
  });
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState<{
    labels: string[];
    data: number[];
    cumulative: number[];
  }>({
    labels: [],
    data: [],
    cumulative: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    const loadTransferHistory = async () => {
      if (!currentUser) return;
      try {
        const history = await getWithdrawalHistory(currentUser.id);
        setRecentTransfers(history);
        
        // Calculate income statistics
        calculateIncomeStats(history);
        
        // Process payment history data
        processPaymentHistory(history);
      } catch (error) {
        console.error('Error loading transfer history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransferHistory();
  }, [currentUser]);

  // Separate useEffect for income week data
  useEffect(() => {
    const loadIncomeData = async () => {
      if (!currentUser || !recentTransfers.length) return;
      await loadWeekData(incomeWeekStart, recentTransfers);
    };
    loadIncomeData();
  }, [currentUser, incomeWeekStart, recentTransfers]);

  // Separate useEffect for questions week data
  useEffect(() => {
    const loadQuestionData = async () => {
      if (!currentUser) return;
      await loadQuestionsData(questionsWeekStart);
    };
    loadQuestionData();
  }, [currentUser, questionsWeekStart]);

  const calculateIncomeStats = (transfers: any[]) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const stats = transfers.reduce((acc, transfer) => {
      const transferDate = new Date(transfer.date);
      const amount = (transfer.amount || 0) * 0.8; // 80% share

      // Total income
      acc.total += amount;

      // Today's income
      if (transferDate.toDateString() === today.toDateString()) {
        acc.today += amount;
      }

      // This month's income
      if (transferDate >= firstDayOfMonth && transferDate <= today) {
        acc.thisMonth += amount;
      }

      // Last month's income
      if (transferDate >= firstDayOfLastMonth && transferDate <= lastDayOfLastMonth) {
        acc.lastMonth += amount;
      }

      return acc;
    }, {
      total: 0,
      today: 0,
      thisMonth: 0,
      lastMonth: 0
    });

    setIncomeStats(stats);
  };

  const loadWeekData = async (startDate: Date, transfers: any[] = recentTransfers) => {
    if (!currentUser) return;
    
    try {
      // Get the start of the week (Sunday)
      const weekStart = new Date(startDate);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date;
      });

      // Filter transfers for the selected week and aggregate by day
      const weekData = weekDays.map(day => {
        const dayTransfers = transfers.filter(transfer => {
          const transferDate = new Date(transfer.date);
          return transferDate.toDateString() === day.toDateString();
        });
        
        return dayTransfers.reduce((sum, transfer) => sum + ((transfer.amount || 0) * 0.8), 0);
      });

      setDailyIncomeData({
        labels: weekDays.map(date => 
          date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short'
          })
        ),
        data: weekData
      });
    } catch (error) {
      console.error('Error loading week data:', error);
    }
  };

  const loadQuestionsData = async (startDate: Date) => {
    if (!currentUser) return;
    
    try {
      // Get the start of the week (Sunday)
      const weekStart = new Date(startDate);
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date;
      });

      // Get all questions for the creator
      const allQuestions = await getCreatorQuestions(currentUser.id);

      // Calculate received and answered questions per day
      const weekData = weekDays.map(day => {
        const dayQuestions = allQuestions.filter(q => {
          const questionDate = new Date(q.createdAt);
          return questionDate.toDateString() === day.toDateString();
        });

        const answered = dayQuestions.filter(q => 
          q.status === 'answered' && 
          new Date(q.answeredAt || '').toDateString() === day.toDateString()
        ).length;

        return {
          received: dayQuestions.length,
          answered
        };
      });

      setQuestionsData({
        labels: weekDays.map(date => 
          date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'short'
          })
        ),
        received: weekData.map(d => d.received),
        answered: weekData.map(d => d.answered)
      });
    } catch (error) {
      console.error('Error loading questions data:', error);
    }
  };

  const processPaymentHistory = (transfers: any[]) => {
    // Sort transfers by date
    const sortedTransfers = [...transfers].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group transfers by date and calculate daily totals
    const dailyTotals = sortedTransfers.reduce((acc: any, transfer) => {
      const date = new Date(transfer.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += (transfer.amount || 0) * 0.8;
      return acc;
    }, {});

    // Calculate cumulative totals
    let cumulative = 0;
    const cumulativeTotals = Object.values(dailyTotals).map((amount: any) => {
      cumulative += amount;
      return cumulative;
    });

    setPaymentHistoryData({
      labels: Object.keys(dailyTotals),
      data: Object.values(dailyTotals) as number[],
      cumulative: cumulativeTotals as number[]
    });
  };

  const navigateIncomeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(incomeWeekStart);
    newDate.setHours(0, 0, 0, 0);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setIncomeWeekStart(newDate);
  };

  const navigateQuestionsWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(questionsWeekStart);
    newDate.setHours(0, 0, 0, 0);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setQuestionsWeekStart(newDate);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(tickValue: number | string) {
            return formatCurrency(Number(tickValue));
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  const chartData = {
    labels: dailyIncomeData.labels,
    datasets: [
      {
        data: dailyIncomeData.data,
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  const questionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF',
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  const questionsChartData = {
    labels: questionsData.labels,
    datasets: [
      {
        label: 'Questions Received',
        data: questionsData.received,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 5
      },
      {
        label: 'Questions Answered',
        data: questionsData.answered,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 5
      }
    ]
  };

  const paymentHistoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const paymentHistoryChartData = {
    labels: paymentHistoryData.labels,
    datasets: [
      {
        label: 'Daily Income',
        data: paymentHistoryData.data,
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Cumulative Income',
        data: paymentHistoryData.cumulative,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedTransfers = [...recentTransfers].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortConfig.key === 'amount') {
      return sortConfig.direction === 'asc'
        ? (a.amount || 0) - (b.amount || 0)
        : (b.amount || 0) - (a.amount || 0);
    }
    if (sortConfig.key === 'status') {
      return sortConfig.direction === 'asc'
        ? (a.status || '').localeCompare(b.status || '')
        : (b.status || '').localeCompare(a.status || '');
    }
    return 0;
  });

  const totalPages = Math.ceil(recentTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className="space-y-6 px-4 lg:px-6 max-w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="bg-dark-100">
          <div className="text-center p-2 lg:p-4">
            <p className="text-light-300 text-xs lg:text-sm mb-1 truncate">Total Income</p>
            <p className="text-base lg:text-3xl font-bold text-white">{formatCurrency(incomeStats.total)}</p>
          </div>
        </Card>
        <Card className="bg-dark-100">
          <div className="text-center p-2 lg:p-4">
            <p className="text-light-300 text-xs lg:text-sm mb-1 truncate">Income Today</p>
            <p className="text-base lg:text-3xl font-bold text-white">{formatCurrency(incomeStats.today)}</p>
          </div>
        </Card>
        <Card className="bg-dark-100">
          <div className="text-center p-2 lg:p-4">
            <p className="text-light-300 text-xs lg:text-sm mb-1 truncate">Income this month</p>
            <p className="text-base lg:text-3xl font-bold text-white">{formatCurrency(incomeStats.thisMonth)}</p>
          </div>
        </Card>
        <Card className="bg-dark-100">
          <div className="text-center p-2 lg:p-4">
            <p className="text-light-300 text-xs lg:text-sm mb-1 truncate">Income last month</p>
            <p className="text-base lg:text-3xl font-bold text-white">{formatCurrency(incomeStats.lastMonth)}</p>
          </div>
        </Card>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-dark-100 p-3 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-medium text-white">Income Analytics</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-48 lg:h-64">
              <Bar options={chartOptions} data={chartData} />
            </div>
            <div className="flex items-center justify-center gap-2 lg:gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => navigateIncomeWeek('prev')}
                className="text-light-300 hover:text-white p-1"
              >
                <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <span className="text-light-300 text-xs lg:text-sm whitespace-nowrap">
                {incomeWeekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - 
                {new Date(incomeWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
              <Button
                variant="ghost"
                onClick={() => navigateIncomeWeek('next')}
                className="text-light-300 hover:text-white p-1"
                disabled={new Date(incomeWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).getTime() >= new Date().getTime()}
              >
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-dark-100 p-3 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base lg:text-lg font-medium text-white">Questions Analytics</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full h-48 lg:h-64">
              <Bar options={questionsChartOptions} data={questionsChartData} />
            </div>
            <div className="flex items-center justify-center gap-2 lg:gap-4 mt-4">
              <Button
                variant="ghost"
                onClick={() => navigateQuestionsWeek('prev')}
                className="text-light-300 hover:text-white p-1"
              >
                <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <span className="text-light-300 text-xs lg:text-sm whitespace-nowrap">
                {questionsWeekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - 
                {new Date(questionsWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
              </span>
              <Button
                variant="ghost"
                onClick={() => navigateQuestionsWeek('next')}
                className="text-light-300 hover:text-white p-1"
                disabled={new Date(questionsWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).getTime() >= new Date().getTime()}
              >
                <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment History Card */}
      <Card className="bg-dark-100 p-3 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-medium text-white">Payment History</h3>
          <div className="text-light-300 text-xs lg:text-sm">
            <span className="text-accent-green">Automatic transfers</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : recentTransfers.length > 0 ? (
          // The container dynamically sets a max-height if there are 7 or more entries.
          <div
            className="w-full overflow-x-auto overflow-y-auto rounded-lg border border-gray-700"
            style={{ maxHeight: sortedTransfers.length >= 7 ? "400px" : "auto" }}
          >
            <table className="w-full table-auto">
              <thead className="sticky top-0 bg-dark-200 z-10">
                <tr>
                  {/* Always show Date */}
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-light-300 uppercase tracking-wider cursor-pointer hover:text-white bg-dark-200"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  {/* Show Amount only on small screens and up */}
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-light-300 uppercase tracking-wider cursor-pointer hover:text-white bg-dark-200 hidden sm:table-cell"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  {/* Show Status only on small screens and up */}
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-light-300 uppercase tracking-wider cursor-pointer hover:text-white bg-dark-200 hidden sm:table-cell"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  {/* Show Question only on medium screens and up */}
                  <th className="px-4 py-3 text-left text-xs font-medium text-light-300 uppercase tracking-wider bg-dark-200 hidden md:table-cell">
                    Question
                  </th>
                  {/* Details column remains always visible */}
                  <th className="px-4 py-3 text-right text-xs font-medium text-light-300 uppercase tracking-wider bg-dark-200">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {sortedTransfers.map((transfer, index) => (
                  <React.Fragment key={transfer.id || index}>
                    <tr className={`hover:bg-dark-200 transition-colors ${
                      selectedPayment?.id === transfer.id ? 'bg-dark-200' : ''
                    }`}>
                      <td className="px-4 py-3 text-sm text-light-200 whitespace-nowrap">
                        {new Date(transfer.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      {/* Hidden on extra-small screens */}
                      <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap hidden sm:table-cell">
                        {formatCurrency(transfer.amount * 0.8)}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          transfer.status === 'completed' || transfer.status === 'processed'
                            ? 'bg-accent-green/20 text-accent-green'
                            : transfer.status === 'pending'
                            ? 'bg-accent-blue/20 text-accent-blue'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {(transfer.status || 'Processing').charAt(0).toUpperCase() +
                          (transfer.status || 'Processing').slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-light-200 whitespace-nowrap hidden md:table-cell">
                        <div className="truncate">
                          {transfer.questionId || 'Direct Transfer'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          className="text-light-300 hover:text-white p-1"
                          onClick={() => setSelectedPayment(
                            selectedPayment?.id === transfer.id ? null : transfer
                          )}
                        >
                          {selectedPayment?.id === transfer.id ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                    {selectedPayment?.id === transfer.id && (
                      <tr className="bg-dark-200">
                        <td colSpan={5} className="px-4 py-3 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-light-300">Transfer ID:</span>
                              <p className="text-white font-medium mt-1 break-all">{transfer.id}</p>
                            </div>
                            <div>
                              <span className="text-light-300">Processing Time:</span>
                              <p className="text-white font-medium mt-1">1-3 business days</p>
                            </div>
                            {transfer.questionId && (
                              <div>
                                <span className="text-light-300">Question Details:</span>
                                <p className="text-white font-medium mt-1 break-all">
                                  ID: {transfer.questionId}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-light-300 text-sm">No payment history yet</p>
            <p className="text-xs lg:text-sm text-light-300 mt-2">
              You'll receive 80% of each question payment directly to your bank account
            </p>
          </div>
        )}
      </Card>


      {/* FAQ Section */}
      <Card className="bg-dark-100 p-3 lg:p-6">
        <button 
          className="w-full flex items-center justify-between"
          onClick={() => toggleSection('faq')}
        >
          <h3 className="text-base lg:text-lg font-medium text-white">Frequently Asked Questions</h3>
          {expandedSection === 'faq' ? (
            <ChevronUp className="h-4 w-4 lg:h-5 lg:w-5 text-light-300" />
          ) : (
            <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5 text-light-300" />
          )}
        </button>
        {expandedSection === 'faq' && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-700 animate-fadeIn">
            <div>
              <h4 className="text-sm lg:text-base text-white font-medium">How are payments processed?</h4>
              <p className="text-xs lg:text-sm text-light-300 mt-1">
                When a user pays for a question, 80% of the amount is instantly transferred 
                to your bank account via our secure payment system. This maximizes your income while 
                ensuring a seamless experience for both you and your audience.
              </p>
            </div>
            <div>
              <h4 className="text-sm lg:text-base text-white font-medium">When will I receive my money?</h4>
              <p className="text-xs lg:text-sm text-light-300 mt-1">
                You receive your 80% share automatically when a question is paid for. 
                The money is transferred directly to your linked bank account, typically 
                within 1-3 business days.
              </p>
            </div>
            <div>
              <h4 className="text-sm lg:text-base text-white font-medium">What is my share of each payment?</h4>
              <p className="text-xs lg:text-sm text-light-300 mt-1">
                You receive 80% of each question payment, which is higher than most 
                creator platforms. This ensures you're fairly compensated for your 
                expertise and time spent answering questions.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Income;
