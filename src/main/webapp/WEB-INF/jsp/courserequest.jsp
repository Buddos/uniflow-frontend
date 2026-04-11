<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Course Request Dashboard" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow course request handshake dashboard" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in">
        <div>
          <h1 class="text-2xl font-heading font-bold text-foreground">Course Request Dashboard</h1>
          <p class="mt-1 text-sm text-muted-foreground">Handshake review for incoming and outgoing departmental requests</p>
        </div>

        <c:if test="${not empty editingRequest}">
          <section class="rounded-lg border border-warning/30 bg-warning/10 p-4 shadow-card">
            <div class="mb-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-warning">Edit &amp; Resubmit</p>
              <h2 class="mt-1 text-lg font-heading font-bold text-foreground">Pre-filled request form</h2>
              <p class="mt-1 text-sm text-muted-foreground">Update the rejected request details and resubmit it to the handshake queue.</p>
            </div>

            <form action="${pageContext.request.contextPath}/CourseRequestServlet" method="post" class="space-y-4">
              <input type="hidden" name="action" value="resubmit" />
              <input type="hidden" name="requestId" value="${editingRequest.id}" />

              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="editCourseUnit" class="text-sm font-medium text-foreground">Course Unit</label>
                  <input id="editCourseUnit" name="courseUnit" type="text" value="${editingRequest.courseUnit}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" required />
                </div>
                <div class="space-y-2">
                  <label for="editCourseCode" class="text-sm font-medium text-foreground">Course Code</label>
                  <input id="editCourseCode" name="courseCode" type="text" value="${editingRequest.courseCode}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" required />
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="editRequestingDept" class="text-sm font-medium text-foreground">Requesting Department</label>
                  <input id="editRequestingDept" name="requestingDept" type="text" value="${editingRequest.requestingDept}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" required />
                </div>
                <div class="space-y-2">
                  <label for="editProvidingDept" class="text-sm font-medium text-foreground">Providing Department</label>
                  <input id="editProvidingDept" name="providingDept" type="text" value="${editingRequest.providingDept}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" required />
                </div>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label for="editExpectedStudents" class="text-sm font-medium text-foreground">Expected Students</label>
                  <input id="editExpectedStudents" name="cohortSize" type="number" min="1" value="${editingRequest.cohortSize}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" required />
                </div>
                <div class="space-y-2">
                  <label for="editNotes" class="text-sm font-medium text-foreground">Notes</label>
                  <input id="editNotes" name="notes" type="text" value="${editingRequest.notes}" class="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary" />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Resubmit Request
                </button>
              </div>
            </form>
          </section>
        </c:if>

        <section class="space-y-4">
          <div>
            <h2 class="text-lg font-heading font-bold text-foreground">Incoming Requests</h2>
            <p class="text-sm text-muted-foreground">Requests from other departments awaiting your handshake response</p>
          </div>

          <c:if test="${empty incomingRequests}">
            <div class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">
              No incoming requests are waiting for review.
            </div>
          </c:if>

          <c:forEach var="request" items="${incomingRequests}">
            <article class="rounded-lg border border-border bg-card p-4 shadow-card">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-heading font-bold text-foreground">${request.courseUnit}</h3>
                    <span class="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">${request.courseCode}</span>
                    <span class="rounded-full bg-warning/15 px-2 py-1 text-xs font-medium text-warning">Pending</span>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    ${request.requestingDept} requesting support from ${request.providingDept}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Expected students: ${request.cohortSize} • Requested: ${request.requestDate}
                  </p>
                  <c:if test="${not empty request.notes}">
                    <p class="text-sm text-foreground">${request.notes}</p>
                  </c:if>
                </div>

                <div class="grid gap-3 lg:w-[22rem]">
                  <form action="${pageContext.request.contextPath}/CourseRequestServlet" method="post" class="space-y-2 rounded-md border border-success/30 bg-success/5 p-3">
                    <input type="hidden" name="action" value="approve" />
                    <input type="hidden" name="requestId" value="${request.id}" />
                    <button type="submit" class="inline-flex h-10 w-full items-center justify-center rounded-md bg-success px-4 py-2 text-sm font-medium text-success-foreground transition-colors hover:bg-success/90">
                      Approve
                    </button>
                  </form>

                  <form action="${pageContext.request.contextPath}/CourseRequestServlet" method="post" class="space-y-2 rounded-md border border-destructive/30 bg-destructive/10 p-3">
                    <input type="hidden" name="action" value="reject" />
                    <input type="hidden" name="requestId" value="${request.id}" />
                    <label for="rejectReason-${request.id}" class="text-xs font-semibold uppercase tracking-wide text-destructive">Reject reason</label>
                    <textarea id="rejectReason-${request.id}" name="reason" rows="3" required class="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-destructive" placeholder="Explain why this request cannot be accepted"></textarea>
                    <button type="submit" class="inline-flex h-10 w-full items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            </article>
          </c:forEach>
        </section>

        <section class="space-y-4">
          <div>
            <h2 class="text-lg font-heading font-bold text-foreground">Outgoing Requests</h2>
            <p class="text-sm text-muted-foreground">Requests submitted by the current COD and their negotiation status</p>
          </div>

          <c:if test="${empty outgoingRequests}">
            <div class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-card">
              No outgoing requests have been submitted yet.
            </div>
          </c:if>

          <div class="grid gap-4 xl:grid-cols-2">
            <c:forEach var="request" items="${outgoingRequests}">
              <article class="rounded-lg border border-border bg-card p-4 shadow-card">
                <div class="flex flex-col gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-base font-heading font-bold text-foreground">${request.courseUnit}</h3>
                    <span class="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">${request.courseCode}</span>
                    <c:choose>
                      <c:when test="${request.status == 'REJECTED' or request.status == 'rejected'}">
                        <span class="rounded-full bg-destructive/15 px-2 py-1 text-xs font-medium text-destructive">Rejected</span>
                      </c:when>
                      <c:when test="${request.status == 'ACCEPTED' or request.status == 'accepted'}">
                        <span class="rounded-full bg-success/15 px-2 py-1 text-xs font-medium text-success">Accepted</span>
                      </c:when>
                      <c:otherwise>
                        <span class="rounded-full bg-warning/15 px-2 py-1 text-xs font-medium text-warning">Pending</span>
                      </c:otherwise>
                    </c:choose>
                  </div>

                  <p class="text-sm text-muted-foreground">
                    From ${request.requestingDept} to ${request.providingDept}
                  </p>

                  <p class="text-xs text-muted-foreground">
                    Expected students: ${request.cohortSize} • Requested: ${request.requestDate}
                  </p>

                  <c:if test="${request.status == 'REJECTED' or request.status == 'rejected'}">
                    <div class="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                      <p class="text-xs font-semibold uppercase tracking-wide">Rejected</p>
                      <p class="mt-1 text-sm">${not empty request.rejectionReason ? request.rejectionReason : 'No rejection reason was provided.'}</p>
                    </div>

                    <form action="${pageContext.request.contextPath}/CourseRequestServlet" method="get" class="mt-2">
                      <input type="hidden" name="action" value="edit" />
                      <input type="hidden" name="requestId" value="${request.id}" />
                      <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
                        Edit &amp; Resubmit
                      </button>
                    </form>
                  </c:if>
                </div>
              </article>
            </c:forEach>
          </div>
        </section>
      </div>
    </main>
  </div>
</body>
</html>