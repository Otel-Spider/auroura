import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Head } from '@inertiajs/react';
import {
  Sidebar,
  Topbar
} from '../../components/shared';
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      <Head title="eCommerce Dashboard" />
      <div className={`App ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Topbar onToggleSidebar={toggleSidebar} auth={auth} />

        <div className="main-content">
          <Container fluid>
            {/* Row 1: KPI Cards */}
            <Row className="mb-4 g-3">
              {kpiData.map((kpi) => (
                <Col key={kpi.id} lg={3} md={6}>
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
            <Row className="mb-4 g-3">
              <Col lg={8}>
                <PerformanceChart
                  data={performanceData}
                  stats={performanceStats}
                />
              </Col>
              <Col lg={4}>
                <DoughnutCard
                  data={doughnutData}
                  total={doughnutTotal}
                  label={doughnutLabel}
                />
              </Col>
            </Row>

            {/* Row 3: Weekly Visits */}
            <Row className="mb-4 g-3">
              <Col xs={12}>
                <WeeklyVisits data={weeklyVisitsData} />
              </Col>
            </Row>

            {/* Row 4: Three Cards */}
            <Row className="mb-4 g-3">
              <Col lg={4}>
                <NewCustomers customers={newCustomersData} />
              </Col>
              <Col lg={4}>
                <TopProducts products={topProductsData} />
              </Col>
              <Col lg={4}>
                <SocialLeads leads={socialLeadsData} />
              </Col>
            </Row>

            {/* Row 5: Orders Table */}
            <Row className="g-3">
              <Col xs={12}>
                <OrdersTable orders={ordersData} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
}
