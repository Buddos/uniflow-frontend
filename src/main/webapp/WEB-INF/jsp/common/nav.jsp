<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<nav class="flex h-screen w-80 flex-col border-r border-border bg-card/95 backdrop-blur-sm shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
  <div class="px-4 py-5 flex items-center gap-3 border-b border-border">
    <div class="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
      <span class="text-primary-foreground text-sm font-bold">U</span>
    </div>
    <span class="font-heading font-bold text-sidebar-foreground text-lg">UniFlow</span>
  </div>

  <div class="flex-1 overflow-y-auto px-2 py-3 space-y-4">
    <div>
      <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Main</p>
      <a href="${pageContext.request.contextPath}/dashboard" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
        <span>▣</span><span>Dashboard</span>
      </a>
    </div>

    <c:if test="${currentRole == 'ADMIN' or currentRole == 'COD' or currentRole == 'LECTURER'}">
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Planning</p>
        <a href="${pageContext.request.contextPath}/workflow" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Semester Workflow</span>
        </a>
      </div>
    </c:if>

    <div>
      <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Shared</p>
      <c:if test="${currentRole == 'ADMIN' or currentRole == 'COD' or currentRole == 'LECTURER' or currentRole == 'CLASS_REP' or currentRole == 'TIMETABLING_ADMIN' or currentRole == 'STUDENT'}">
        <a href="${pageContext.request.contextPath}/timetable" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Timetable</span>
        </a>
      </c:if>
      <c:if test="${currentRole == 'ADMIN' or currentRole == 'COD' or currentRole == 'LECTURER' or currentRole == 'CLASS_REP' or currentRole == 'TIMETABLING_ADMIN' or currentRole == 'STUDENT'}">
        <a href="${pageContext.request.contextPath}/venues" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Venues</span>
        </a>
      </c:if>
      <c:if test="${currentRole == 'ADMIN' or currentRole == 'COD' or currentRole == 'CLASS_REP' or currentRole == 'STUDENT'}">
        <a href="${pageContext.request.contextPath}/live-map" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Live Map</span>
        </a>
      </c:if>
    </div>

    <c:if test="${currentRole == 'ADMIN' or currentRole == 'COD'}">
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Department</p>
        <a href="${pageContext.request.contextPath}/course-requests" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Course Requests</span>
        </a>
        <a href="${pageContext.request.contextPath}/trips" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Academic Trips</span>
        </a>
      </div>
    </c:if>

    <c:if test="${currentRole == 'LECTURER'}">
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Teaching</p>
        <a href="${pageContext.request.contextPath}/makeup" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Makeup Classes</span>
        </a>
      </div>
    </c:if>

    <c:if test="${currentRole == 'ADMIN'}">
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Management</p>
        <a href="${pageContext.request.contextPath}/equipment" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
          <span>▣</span><span>Equipment</span>
        </a>
      </div>
    </c:if>

    <div>
      <p class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">All</p>
      <a href="${pageContext.request.contextPath}/notifications" class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-sidebar-accent/50 transition-colors">
        <span>▣</span><span>Notifications</span>
        <c:if test="${not empty unreadNotificationCount && unreadNotificationCount > 0}">
          <span class="ml-auto rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">${unreadNotificationCount}</span>
        </c:if>
      </a>
    </div>
  </div>

  <div class="p-3 border-t border-border space-y-2">
    <c:if test="${currentRole == 'COD' and rejectedRequestCount > 0}">
      <a href="${pageContext.request.contextPath}/course-requests" class="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/15 transition-colors">
        <span>Request Rejections</span>
        <span class="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">${rejectedRequestCount}</span>
      </a>
    </c:if>
    <div class="px-2 py-2">
      <p class="text-sm font-medium text-sidebar-foreground truncate">${not empty currentUser.name ? currentUser.name : 'Guest'}</p>
      <p class="text-xs text-sidebar-foreground/60">${not empty currentRole ? currentRole : 'UNKNOWN'}</p>
    </div>
    <form action="${pageContext.request.contextPath}/logout" method="post">
      <button type="submit" class="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
        <span>⇦</span><span>Sign Out</span>
      </button>
    </form>
  </div>
</nav>
