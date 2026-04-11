<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Class Rep Feedback" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow student feedback submission form" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 class="text-2xl font-heading font-bold text-foreground">Class Rep Feedback</h1>
          <p class="mt-1 text-sm text-muted-foreground">Students can report classroom issues and scheduling conflicts here</p>
        </div>

        <c:if test="${currentRole != 'STUDENT'}">
          <div class="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
            Feedback submission is intended for students.
          </div>
        </c:if>

        <form action="${pageContext.request.contextPath}/ClassRepFeedbackServlet" method="post" class="space-y-4 rounded-lg border border-border bg-card p-4 shadow-card">
          <input type="hidden" name="reportedBy" value="${currentUser.name}" />

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label for="courseCode" class="text-sm font-medium text-foreground">Course Code</label>
              <input id="courseCode" name="courseCode" type="text" required class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" placeholder="e.g. CS201" />
            </div>
            <div class="space-y-2">
              <label for="courseUnit" class="text-sm font-medium text-foreground">Course Unit</label>
              <input id="courseUnit" name="courseUnit" type="text" required class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" placeholder="e.g. Data Structures" />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label for="venue" class="text-sm font-medium text-foreground">Venue</label>
              <input id="venue" name="venue" type="text" required class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" placeholder="e.g. PST 1" />
            </div>
            <div class="space-y-2">
              <label for="issue" class="text-sm font-medium text-foreground">Issue Type</label>
              <select id="issue" name="issue" required class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary">
                <option value="">Select an issue</option>
                <option value="overcrowding">Overcrowding</option>
                <option value="equipment">Equipment</option>
                <option value="wrong-venue">Wrong Venue</option>
                <option value="scheduling-conflict">Scheduling Conflict</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="description" class="text-sm font-medium text-foreground">Description</label>
            <textarea id="description" name="description" rows="5" required class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" placeholder="Describe the problem clearly"></textarea>
          </div>

          <c:if test="${currentRole == 'STUDENT'}">
            <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Submit Report
            </button>
          </c:if>

          <c:if test="${currentRole != 'STUDENT'}">
            <button type="submit" disabled class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-60">
              Submit Report
            </button>
          </c:if>
        </form>
      </div>
    </main>
  </div>
</body>
</html>