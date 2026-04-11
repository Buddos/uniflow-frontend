<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="pageTitle" value="Equipment Inventory" />
<c:set var="currentUser" value="${not empty user ? user : sessionScope.user}" />
<c:set var="currentRole" value="${not empty currentUser.role ? currentUser.role : sessionScope.userRole}" />
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <meta name="description" content="UniFlow equipment inventory and voucher dashboard" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/app.css" />
</head>
<body class="min-h-screen bg-slate-50 text-slate-900">
  <div class="flex min-h-screen">
    <jsp:include page="common/nav.jsp" />

    <main class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div class="space-y-6 animate-fade-in">
        <div>
          <h1 class="text-2xl font-heading font-bold text-foreground">Equipment Tracking</h1>
          <p class="mt-1 text-sm text-muted-foreground">Monitor available equipment and access digital vouchers</p>
        </div>

        <section class="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div class="border-b border-border px-4 py-3">
            <h2 class="text-lg font-heading font-bold text-foreground">Available Equipment</h2>
            <p class="text-sm text-muted-foreground">List of inventory records supplied by the servlet</p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px]">
              <thead>
                <tr class="bg-secondary/50">
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Equipment</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Assigned Venue</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Resource Home</th>
                  <th class="p-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                <c:if test="${empty equipment}">
                  <tr>
                    <td colspan="5" class="p-8 text-center text-sm text-muted-foreground">No equipment records are available yet.</td>
                  </tr>
                </c:if>

                <c:set var="availableCount" value="0" />

                <c:forEach var="item" items="${equipment}">
                  <c:if test="${item.status == 'available'}">
                    <c:set var="availableCount" value="${availableCount + 1}" />
                    <tr class="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                      <td class="p-3 text-sm font-medium text-foreground">${item.name}</td>
                      <td class="p-3 text-sm text-muted-foreground">${item.type}</td>
                      <td class="p-3 text-sm text-foreground">${item.assignedVenue}</td>
                      <td class="p-3 text-sm text-muted-foreground">${item.resourceHome}</td>
                      <td class="p-3 text-sm text-foreground">
                        <span class="rounded-full px-2 py-1 text-xs font-medium bg-success/15 text-success">
                          ${item.status}
                        </span>
                      </td>
                    </tr>
                  </c:if>
                </c:forEach>

                <c:if test="${not empty equipment and availableCount == 0}">
                  <tr>
                    <td colspan="5" class="p-8 text-center text-sm text-muted-foreground">No available equipment matches the current inventory snapshot.</td>
                  </tr>
                </c:if>
              </tbody>
            </table>
          </div>
        </section>

        <section class="space-y-4">
          <div>
            <h2 class="text-lg font-heading font-bold text-foreground">My Vouchers</h2>
            <p class="text-sm text-muted-foreground">Digital voucher QR codes served by EquipmentServlet</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <c:if test="${empty myVouchers}">
              <div class="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-card sm:col-span-2 xl:col-span-3">
                No vouchers are available for the current user.
              </div>
            </c:if>

            <c:forEach var="voucher" items="${myVouchers}">
              <article class="rounded-lg border border-border bg-card p-4 shadow-card">
                <div class="mb-3">
                  <h3 class="text-base font-heading font-bold text-foreground">${voucher.label}</h3>
                  <p class="text-xs text-muted-foreground">Voucher ID: ${voucher.id}</p>
                </div>
                <img
                  src="${pageContext.request.contextPath}/equipment/qr?id=${voucher.id}"
                  alt="Equipment voucher QR for ${voucher.label}"
                  class="w-full rounded-md border border-border bg-white p-3"
                />
              </article>
            </c:forEach>
          </div>
        </section>
      </div>
    </main>
  </div>
</body>
</html>