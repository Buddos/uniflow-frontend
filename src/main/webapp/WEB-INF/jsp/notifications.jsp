<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Notifications" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow notifications dashboard" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in">
        <div>
          <h1 class="text-2xl font-heading font-bold text-foreground">Notifications</h1>
          <p class="mt-1 text-sm text-muted-foreground">Stay updated on requests, changes, and alerts</p>
        </div>

        <c:if test="${not empty unreadNotificationCount && unreadNotificationCount > 0}">
          <div class="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
            You have ${unreadNotificationCount} unread notification${unreadNotificationCount > 1 ? 's' : ''}.
          </div>
        </c:if>

        <div class="space-y-3 max-w-3xl">
          <c:if test="${empty notifications}">
            <div class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">
              No notifications yet.
            </div>
          </c:if>

          <c:forEach var="notification" items="${notifications}">
            <article class="rounded-lg border border-border bg-card p-4 shadow-card ${not notification.read ? 'border-l-2 border-l-primary' : ''}">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span class="text-xs font-bold text-primary">${notification.type}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-sm font-medium text-foreground">${notification.title}</p>
                    <c:if test="${not notification.read}">
                      <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                    </c:if>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">${notification.message}</p>
                  <p class="text-xs text-muted-foreground/60 mt-1">${notification.timestamp}</p>
                </div>
              </div>
            </article>
          </c:forEach>
        </div>
      </div>
    </main>
  </div>
</body>
</html>