<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="${empty pageTitle ? 'UniFlow' : pageTitle}" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow - University Timetabling and Resource Management" />
  <meta name="author" content="UniFlow Team" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
  <script>
    window.__USER_ROLE = '${currentRole}';
  </script>
  <script src="${pageContext.request.contextPath}/assets/js/app.js" defer></script>
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <header class="h-14 flex items-center justify-between border-b border-border bg-card px-4">
    <div class="flex items-center gap-3">
      <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm hover:bg-secondary transition-colors" aria-label="Toggle navigation">
        ☰
      </button>
      <div class="hidden sm:block">
        <h2 class="text-sm font-medium text-foreground">
          Welcome, ${not empty currentUser.name ? currentUser.name : 'Guest'}
        </h2>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="${pageContext.request.contextPath}/notifications" class="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-secondary transition-colors" aria-label="Notifications">
        <span class="inline-flex h-5 w-5 items-center justify-center text-muted-foreground">🔔</span>
        <c:if test="${not empty unreadNotificationCount && unreadNotificationCount > 0}">
          <span class="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">${unreadNotificationCount}</span>
        </c:if>
      </a>
      <div class="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
        ${not empty currentUser.name ? currentUser.name.charAt(0) : 'U'}
      </div>
    </div>
  </header>
