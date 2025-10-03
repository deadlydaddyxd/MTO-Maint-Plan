import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics';

const DashboardAnalytics = ({ user }) => {
  const [stats, setStats] = useState({});
  const [equipmentByLocation, setEquipmentByLocation] = useState({});
  const [driverStats, setDriverStats] = useState({});
  const [maintenanceTrends, setMaintenanceTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [dashboardRes, equipmentRes, driversRes, trendsRes] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getEquipmentByLocationStats(),
        analyticsService.getDriverStats(),
        analyticsService.getMaintenanceTrends()
      ]);

      if (dashboardRes.success) {
        setStats(dashboardRes.stats);
      }

      if (equipmentRes.success) {
        setEquipmentByLocation(equipmentRes.data);
      }

      if (driversRes.success) {
        setDriverStats(driversRes.data);
      }

      if (trendsRes.success) {
        setMaintenanceTrends(trendsRes.data);
      }

    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <p>{error}</p>
        <button onClick={loadAnalytics}>Retry</button>
      </div>
    );
  }

  // Prepare chart data
  const equipmentLocationData = Object.entries(equipmentByLocation).map(([location, data]) => ({
    location,
    total: data.total,
    categories: Object.entries(data.categories).map(([category, count]) => ({
      category,
      count
    }))
  }));

  const driverStatusData = Object.entries(driverStats.byStatus || {}).map(([status, count]) => ({
    status,
    count,
    percentage: ((count / driverStats.total) * 100).toFixed(1)
  }));

  const priorityData = Object.entries(stats.maintenance?.byPriority || {}).map(([priority, count]) => ({
    priority,
    count,
    color: getPriorityColor(priority)
  }));

  function getPriorityColor(priority) {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  }

  return (
    <div className="dashboard-analytics">
      {/* Summary Cards */}
      <div className="analytics-summary">
        <div className="summary-card vehicles">
          <h3>🚗 Fleet Overview</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Vehicles</span>
              <span className="stat-value">{stats.vehicles?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Age</span>
              <span className="stat-value">{stats.vehicles?.averageAge || 0} years</span>
            </div>
          </div>
        </div>

        <div className="summary-card drivers">
          <h3>👥 Personnel</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Drivers</span>
              <span className="stat-value">{stats.drivers?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active</span>
              <span className="stat-value">{stats.drivers?.byStatus?.Active || 0}</span>
            </div>
          </div>
        </div>

        <div className="summary-card maintenance">
          <h3>🔧 Maintenance</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.maintenance?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">
                {stats.maintenance?.total > 0 
                  ? Math.round((stats.maintenance?.completed / stats.maintenance?.total) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Equipment by Location Chart */}
        <div className="chart-card">
          <h3>📍 Equipment Distribution by Location</h3>
          <div className="chart-container">
            {equipmentLocationData.length > 0 ? (
              <div className="location-chart">
                {equipmentLocationData.map((location, index) => (
                  <div key={location.location} className="location-bar">
                    <div className="location-info">
                      <span className="location-name">{location.location}</span>
                      <span className="location-count">{location.total} vehicles</span>
                    </div>
                    <div className="location-progress">
                      <div 
                        className="location-fill"
                        style={{
                          width: `${(location.total / Math.max(...equipmentLocationData.map(l => l.total))) * 100}%`,
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                        }}
                      ></div>
                    </div>
                    <div className="category-breakdown">
                      {location.categories.map(cat => (
                        <span key={cat.category} className="category-chip">
                          {cat.category}: {cat.count}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No equipment data available</div>
            )}
          </div>
        </div>

        {/* Driver Status Distribution */}
        <div className="chart-card">
          <h3>👤 Driver Status Distribution</h3>
          <div className="chart-container">
            {driverStatusData.length > 0 ? (
              <div className="status-chart">
                {driverStatusData.map((status, index) => (
                  <div key={status.status} className="status-item">
                    <div className="status-info">
                      <span className="status-name">{status.status}</span>
                      <span className="status-count">{status.count} ({status.percentage}%)</span>
                    </div>
                    <div className="status-progress">
                      <div 
                        className="status-fill"
                        style={{
                          width: `${status.percentage}%`,
                          backgroundColor: status.status === 'Active' ? '#10b981' : 
                                         status.status === 'On Leave' ? '#f59e0b' : '#6b7280'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No driver data available</div>
            )}
          </div>
        </div>

        {/* Maintenance Priority Distribution */}
        <div className="chart-card">
          <h3>⚠️ Maintenance Tasks by Priority</h3>
          <div className="chart-container">
            {priorityData.length > 0 ? (
              <div className="priority-chart">
                {priorityData.map(priority => (
                  <div key={priority.priority} className="priority-item">
                    <div className="priority-info">
                      <span className="priority-name">{priority.priority}</span>
                      <span className="priority-count">{priority.count} tasks</span>
                    </div>
                    <div className="priority-progress">
                      <div 
                        className="priority-fill"
                        style={{
                          width: `${(priority.count / Math.max(...priorityData.map(p => p.count))) * 100}%`,
                          backgroundColor: priority.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No maintenance data available</div>
            )}
          </div>
        </div>

        {/* Vehicle Categories */}
        <div className="chart-card">
          <h3>🚙 Vehicle Categories</h3>
          <div className="chart-container">
            {Object.entries(stats.vehicles?.byCategory || {}).length > 0 ? (
              <div className="category-chart">
                {Object.entries(stats.vehicles?.byCategory || {}).map(([category, count], index) => (
                  <div key={category} className="category-item-chart">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{count} vehicles</span>
                    </div>
                    <div className="category-progress">
                      <div 
                        className="category-fill"
                        style={{
                          width: `${(count / stats.vehicles?.total) * 100}%`,
                          backgroundColor: getCategoryColor(category)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No vehicle category data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function getCategoryColor(category) {
    switch (category) {
      case 'A Vehicle': return '#ef4444';
      case 'B Vehicle': return '#3b82f6';
      case 'Plant': return '#f59e0b';
      case 'Generator Set': return '#10b981';
      default: return '#6b7280';
    }
  }
};

export default DashboardAnalytics;