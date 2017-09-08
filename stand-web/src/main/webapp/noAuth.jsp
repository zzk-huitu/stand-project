<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="contextPath" value="${pageContext.request.contextPath}"></c:set>

<!-- ajax layout which only needs content area -->
<div class="row">
	<div class="col-xs-12">
		<!-- PAGE CONTENT BEGINS -->

		<!-- #section:pages/error -->
		<div class="error-container">
			<div class="well">
				<h1 class="grey lighter smaller">
					<span class="blue bigger-125">
						<i class="ace-icon fa fa-sitemap"></i>
						403
					</span>
					用户名有误或已被禁用，您没有此网站的访问权限
				</h1>

				<hr />

				<div>

					<div class="space"></div>
					<h4 class="smaller">试一下以下方法:</h4>

					<ul class="list-unstyled spaced inline bigger-110 margin-15">
						<li>
							<i class="ace-icon fa fa-hand-o-right blue"></i>
							请核对登录的用户名是否正确
						</li>

						<li>
							<i class="ace-icon fa fa-hand-o-right blue"></i>
							请联系管理员，给你的账户开通访问权限
						</li>

						<li>
							<i class="ace-icon fa fa-hand-o-right blue"></i>
							尝试切换登录的账户
						</li>
					</ul>
				</div>

				<hr />
				<div class="space"></div>

				<div class="center">
					<a href="${contextPath}/login/logout" class="btn btn-primary">
						<i class="ace-icon fa fa-tachometer"></i>
						返回登录页
					</a>
				</div>
			</div>
		</div>

		<!-- /section:pages/error -->

		<!-- PAGE CONTENT ENDS -->
	</div><!-- /.col -->
</div><!-- /.row -->

<!-- page specific plugin scripts -->
<script type="text/javascript">
	var scripts = [null, null]
	$('.page-content-area').ace_ajax('loadScripts', scripts, function() {
	  //inline scripts related to this page
	});
</script>
