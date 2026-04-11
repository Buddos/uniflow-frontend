<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Timetable" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow timetable and venue allocation dashboard" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-heading font-bold text-foreground">Timetable</h1>
            <p class="mt-1 text-sm text-muted-foreground">Venue allocations with 110% buffer checks</p>
          </div>

          <c:if test="${currentRole == 'TIMETABLING_ADMIN'}">
            <form action="${pageContext.request.contextPath}/TimetableServlet" method="post">
              <input type="hidden" name="action" value="finalize" />
              <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Finalize Semester
              </button>
            </form>
          </c:if>
        </div>

        <section class="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div class="border-b border-border px-4 py-3">
            <h2 class="text-lg font-heading font-bold text-foreground">Venue Allocations</h2>
            <p class="text-sm text-muted-foreground">Allocations flagged when capacity is below 110% of admitted students</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[820px]">
              <thead>
                <tr class="bg-secondary/50">
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Venue</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Admitted Count</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Venue Capacity</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Buffer Check</th>
                </tr>
              </thead>
              <tbody>
                <c:if test="${empty allocations}">
                  <tr>
                    <td colspan="5" class="p-8 text-center text-sm text-muted-foreground">No timetable allocations have been published yet.</td>
                  </tr>
                </c:if>

                <c:forEach var="allocation" items="${allocations}">
                  <c:set var="bufferThreshold" value="${allocation.admittedCount * 1.1}" />
                  <tr class="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td class="p-3">
                      <p class="text-sm font-medium text-foreground">${allocation.courseUnit}</p>
                      <p class="text-xs text-muted-foreground">${allocation.courseCode}</p>
                    </td>
                    <td class="p-3 text-sm text-foreground">${allocation.venue}</td>
                    <td class="p-3 text-sm text-muted-foreground">${allocation.admittedCount}</td>
                    <td class="p-3 text-sm text-foreground">${allocation.capacity}</td>
                    <td class="p-3 text-sm">
                      <c:if test="${allocation.capacity lt bufferThreshold}">
                        <div class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive">
                          Below 110% buffer
                        </div>
                      </c:if>
                      <c:if test="${allocation.capacity ge bufferThreshold}">
                        <div class="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-success">
                          Buffer satisfied
                        </div>
                      </c:if>
                    </td>
                  </tr>
                </c:forEach>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  </div>
</body>
</html>