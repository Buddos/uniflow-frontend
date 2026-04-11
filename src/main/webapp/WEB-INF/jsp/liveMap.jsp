<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Live Venue Map" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow live venue availability map" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-heading font-bold text-foreground">Live Venue Map</h1>
            <p class="mt-1 text-sm text-muted-foreground">Real-time venue availability overview</p>
            <c:if test="${currentRole == 'STUDENT'}">
              <p class="mt-3 rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success-foreground">
                Green slots indicate rooms released for the public pool. Available for individual or group study until the next scheduled class.
              </p>
            </c:if>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <c:forEach var="venue" items="${venues}">
            <div class="rounded-lg border-2 p-4 transition-all ${venue.status == 'available' ? 'border-success/40 bg-success/5' : venue.status == 'booked' ? 'border-destructive/40 bg-destructive/5' : 'border-warning/40 bg-warning/5'}">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="font-heading text-base font-bold text-foreground">${venue.name}</h2>
                  <p class="mt-1 text-xs text-muted-foreground">${venue.location}</p>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full ${venue.status == 'available' ? 'bg-success' : venue.status == 'booked' ? 'bg-destructive' : 'bg-warning'}"></span>
                  <span class="text-xs font-medium capitalize text-muted-foreground">${venue.status}</span>
                </div>
              </div>

              <p class="mt-3 text-xs text-muted-foreground">${venue.capacity} seats</p>

              <c:if test="${currentRole == 'LECTURER'}">
                <form action="${pageContext.request.contextPath}/TripServlet" method="post" class="mt-4">
                  <input type="hidden" name="venueId" value="${venue.id}" />
                  <input type="hidden" name="action" value="release" />
                  <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Release Venue
                  </button>
                </form>
              </c:if>
            </div>
          </c:forEach>
        </div>

        <div class="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full bg-success"></span> Available</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full bg-destructive"></span> Occupied</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full bg-warning"></span> Maintenance</span>
        </div>
      </div>
    </main>
  </div>
</body>
</html>