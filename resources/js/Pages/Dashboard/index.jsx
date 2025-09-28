import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import {
  Sidebar,
  Topbar
} from '../../components/shared';
import DashboardFooter from '../../components/shared/DashboardFooter';
import '../../Components/assets/css/shared/dashboard.css';
import {
  KpiCard,
  PerformanceChart,
  DoughnutCard,
  WeeklyVisits,
  NewCustomers,
  TopProducts,
  SocialLeads,
  OrdersTable
} from '../../components/dashboard';
import {
  kpiData,
  performanceData,
  performanceStats,
  doughnutData,
  doughnutTotal,
  doughnutLabel,
  weeklyVisitsData,
  newCustomersData,
  topProductsData,
  socialLeadsData,
  ordersData
} from '../../data/mock';

export default function Dashboard({ auth }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Trigger animations on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title="Dashboard" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />

        <div className="main-content">
          <Container fluid>
            {/* Row 1: KPI Cards */}
            <Row className={`mb-4 g-3 dashboard-row ${isLoaded ? 'animate-in' : 'animate-out'}`} style={{ animationDelay: '0.1s' }}>
              {kpiData.map((kpi, index) => (
                <Col key={kpi.id} lg={3} md={6} className="dashboard-col" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <KpiCard
                    title={kpi.title}
                    value={kpi.value}
                    trend={kpi.trend}
                    trendType={kpi.trendType}
                    icon={kpi.icon}
                  />
                </Col>
              ))}
            </Row>

            {/* Row 2: Performance + Doughnut */}
            <Row className={`mb-4 g-3 dashboard-row ${isLoaded ? 'animate-in' : 'animate-out'}`} style={{ animationDelay: '0.6s' }}>
              <Col lg={8} className="dashboard-col" style={{ animationDelay: '0.7s' }}>
                <PerformanceChart
                  data={performanceData}
                  stats={performanceStats}
                />
              </Col>
              <Col lg={4} className="dashboard-col" style={{ animationDelay: '0.8s' }}>
                <DoughnutCard
                  data={doughnutData}
                  total={doughnutTotal}
                  label={doughnutLabel}
                />
              </Col>
            </Row>

            {/* Row 3: Weekly Visits */}
            <Row className={`mb-4 g-3 dashboard-row ${isLoaded ? 'animate-in' : 'animate-out'}`} style={{ animationDelay: '1.0s' }}>
              <Col xs={12} className="dashboard-col" style={{ animationDelay: '1.1s' }}>
                <WeeklyVisits data={weeklyVisitsData} />
              </Col>
            </Row>

            {/* Row 4: Three Cards */}
            <Row className={`mb-4 g-3 dashboard-row ${isLoaded ? 'animate-in' : 'animate-out'}`} style={{ animationDelay: '1.3s' }}>
              <Col lg={4} className="dashboard-col" style={{ animationDelay: '1.4s' }}>
                <NewCustomers customers={newCustomersData} />
              </Col>
              <Col lg={4} className="dashboard-col" style={{ animationDelay: '1.5s' }}>
                <TopProducts products={topProductsData} />
              </Col>
              <Col lg={4} className="dashboard-col" style={{ animationDelay: '1.6s' }}>
                <SocialLeads leads={socialLeadsData} />
              </Col>
            </Row>

            {/* Row 5: Orders Table */}
            <Row className={`g-3 dashboard-row ${isLoaded ? 'animate-in' : 'animate-out'}`} style={{ animationDelay: '1.8s' }}>
              <Col xs={12} className="dashboard-col" style={{ animationDelay: '1.9s' }}>
                <OrdersTable orders={ordersData} />
              </Col>
            </Row>
          </Container>
          <DashboardFooter />
        </div>
      </div>
    </>
  );
}
