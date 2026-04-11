<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/jsp/common/header.jsp" %>
<div class="min-h-screen flex w-full">
  <jsp:include page="/WEB-INF/jsp/common/nav.jsp" />
  <main class="flex-1 flex flex-col min-w-0">
    <div class="flex-1 p-4 md:p-6 overflow-auto space-y-6">
      <div>
        <h1 class="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p class="text-muted-foreground text-sm mt-1">Server-side rendered overview of scheduling activity</p>
      </div>

      <c:if test="${user.role == 'STUDENT'}">
        <div class="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success-foreground">
          Read-only student access is enabled. You can review your schedule, live map availability, and notices.
        </div>
      </c:if>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <c:forEach var="item" items="${dashboardData}">
          <div class="shadow-card rounded-lg border border-border bg-card p-4">
            <p class="text-sm text-muted-foreground">${item.label}</p>
            <p class="text-3xl font-heading font-bold text-foreground mt-1">${item.value}</p>
            <p class="text-xs text-muted-foreground mt-2">${item.description}</p>
            <c:if test="${item.status == 'rejected'}">
              <div class="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <p class="font-semibold uppercase tracking-wide">Rejected</p>
                <p class="mt-1">${item.rejectionReason}</p>
              </div>
            </c:if>
          </div>
        </c:forEach>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section class="shadow-card rounded-lg border border-border bg-card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-heading font-semibold">Recent Activity</h2>
            <c:if test="${user.role != 'STUDENT'}">
              <a class="text-sm text-primary hover:underline" href="${pageContext.request.contextPath}/workflow">Open Workflow</a>
            </c:if>
          </div>
          <c:if test="${empty dashboardData}">
            <p class="text-sm text-muted-foreground">No data available yet.</p>
          </c:if>
          <c:forEach var="item" items="${dashboardData}">
            <div class="py-2 border-b border-border/50 last:border-0 flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-foreground">${item.title}</p>
                <p class="text-xs text-muted-foreground">${item.subtitle}</p>
              </div>
              <span class="text-xs rounded-full px-2 py-1 bg-secondary text-secondary-foreground">${item.status}</span>
            </div>
          </c:forEach>
        </section>

        <section class="shadow-card rounded-lg border border-border bg-card p-4">
          <h2 class="text-base font-heading font-semibold mb-3">Role Visibility</h2>
          <c:if test="${user.role == 'STUDENT'}">
            <p class="text-sm text-muted-foreground">Student users can only view their enrolled units, live map availability, and announcements.</p>
          </c:if>
          <c:if test="${user.role != 'STUDENT'}">
            <p class="text-sm text-muted-foreground">Administrative users can manage requests, submissions, and timetable operations.</p>
          </c:if>
        </section>
      </div>
    </div>
  </main>
</div>
</body>
</html>
