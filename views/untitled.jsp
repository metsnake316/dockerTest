<%@ page trimDirectiveWhitespaces="true" %><%
%><%@ taglib prefix="cs" uri="futuretense_cs/ftcs1_0.tld"%><%
%><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%
%><%@ taglib prefix="ia" uri="gbd/ia"%><%
%><%@ taglib prefix="ics" uri="futuretense_cs/ics.tld"%><%
%><%@ taglib prefix="render" uri="futuretense_cs/render.tld"%><%
%><%@ page import="com.fatwire.system.*"%><%
%><%@ page import="com.fatwire.assetapi.data.*"%><%
%><%@ page import="java.util.*"%><%
%><%@ page import="com.openmarket.xcelerate.asset.AssetIdImpl"%><%
%><%
%><cs:ftcs><ia:root action="class:com.gbd.ia.elements.NavigationAction"><%
Session sess = SessionFactory.getSession(ics);
AssetDataManager adm = (AssetDataManager) sess.getManager(AssetDataManager.class.getName());
Iterable<AssetData> assets;
List attrNames = new ArrayList();
%>                                                                          <ul><%
%><c:forEach var="nav" items="${navs}"><%
%><ics:setvar name="type" value="${nav.type}"/><%
%><ics:setvar name="id" value="${nav.id}"/><%
AssetId aid = new AssetIdImpl(ics.GetVar("type"), Long.parseLong(ics.GetVar("id")));
attrNames.add( "menuTitle" );
attrNames.add( "pageType" );
attrNames.add( "linkMessageEnvelope" );
AssetData data = adm.readAttributes( aid, attrNames );
AttributeData findMenuData = data.getAttributeData("menuTitle");
AttributeData findPageTypeData = data.getAttributeData("pageType");
 
if(findPageTypeData !=null && findPageTypeData.getData() != null && findPageTypeData.getData().toString().equals("Secure")){
%><render:calltemplate style="element" c="${nav.type}" cid="${nav.id}" tname="nav/Link" >
    <render:argument name="nav" value="1"/>
    <c:if test="${not empty header['SMUSER']}">
    <render:argument name="isLogout" value="true"/>
    <render:argument name="isLogoutNoChange" value="true"/>
    <render:argument name="webroot" value='<%=ics.GetVar("webroot")%>'/>
    </c:if>
    <render:argument name="isSecure" value="true"/>
    <render:argument name="locale" value='<%=ics.GetVar("locale")%>'/>
</render:calltemplate><%
%><c:if test="${not empty header['SMUSER']}"><%
AttributeData findEnvelopeData = data.getAttributeData("linkMessageEnvelope");
if(findEnvelopeData !=null && findEnvelopeData.getData()!=null){
    AssetId linkMessageEnvelope = (AssetId) findEnvelopeData.getData();
	%><render:gettemplateurl 
	    outstr="linkMessageEnvelope"
	    c="GBDContent_P" 
	    cid='<%=Long.toString(linkMessageEnvelope.getId())%>'
	    tname="nav/WRADetail" 
	    wrapperpage="GBD/Wrapper">
	</render:gettemplateurl><%
%><li id="messageCenter-menu" class="desktopOnly"><%
%><a href='<%=ics.GetVar("linkMessageEnvelope")%>'><%
    %><span class="fa fa-envelope messageIcon"><%
    	%><span class="messageNum">0</span><%
    %></span><%
%></a><%
%></li><%
}
%></c:if><%
} else {  
%><render:calltemplate style="element" c="${nav.type}" cid="${nav.id}" tname="nav/Link" >
	<render:argument name="nav" value="1"/>
	<c:if test="${not empty header['SMUSER']}">
	<render:argument name="isLogoutNoChange" value="true"/>
	</c:if>
</render:calltemplate><%
}
                %></c:forEach><%
                %>                          </ul><%
%></div>
<div class="tools">
    <div class="font-sizer">
		<a href="#" class="decreaseFont">A</a>
		<a href="#" class="defaultFont">A</a>
		<a href="#" class="increaseFont">A</a>
    </div>
    <ul><%
	%><c:forEach var="nav" items="${secondnavs}"><%
	%><li><%
	%><ics:setvar name="type" value="${nav.type}"/><%
	%><ics:setvar name="id" value="${nav.id}"/><%
AssetId aid = new AssetIdImpl(ics.GetVar("type"), Long.parseLong(ics.GetVar("id")));
attrNames = new ArrayList();
attrNames.add( "isMotionPoint" );
attrNames.add( "menuTitle" );
AssetData data = adm.readAttributes( aid, attrNames );
AttributeData titleData = data.getAttributeData("isMotionPoint");
AttributeData findMenuData = data.getAttributeData("menuTitle");
if(titleData !=null && titleData.getData() != null && titleData.getData().toString().equals("Enable")){
    String espanolLink = "https://espanol.myamerigroup.com" +  ics.GetVar("webrootName");
%>
                        <a mporgnav class="espanol" href="<%=espanolLink%>" onclick="return switchLanguage('es');
                                function switchLanguage(lang) {
                                MP.SrcUrl=decodeURIComponent('mp_js_orgin_url');MP.UrlLang='mp_js_current_lang';MP.init();
                        MP.switchLanguage(MP.UrlLang==lang?'en':lang);
                                                return false;
                                }
                "><%=findMenuData.getData().toString()%></a><%
        } else if(findMenuData !=null && findMenuData.getData() != null && findMenuData.getData().toString().equals("Login")){
                               %><render:calltemplate style="element" c='<%=ics.GetVar("type")%>' cid='<%=ics.GetVar("id")%>' tname="nav/Link" >
                                                <render:argument name="nav" value="2"/>
                                                <c:if test="${not empty header['SMUSER']}">
                                                <render:argument name="isLogout" value="true"/>
                                                <render:argument name="isLogoutNoChange" value="true"/>
                                                <render:argument name="webroot" value='<%=ics.GetVar("webroot")%>'/>
                                                </c:if>
                                                <render:argument name="locale" value='<%=ics.GetVar("locale")%>'/>
                                </render:calltemplate><%
                } else {
                               %><render:calltemplate style="element" c='<%=ics.GetVar("type")%>' cid='<%=ics.GetVar("id")%>' tname="nav/Link" >
                                                <render:argument name="nav" value="2"/>
                                                <render:argument name="locale" value='<%=ics.GetVar("locale")%>'/>
                                                <c:if test="${not empty header['SMUSER']}">
                                                <render:argument name="isLogoutNoChange" value="true"/>
                                                </c:if>
                                </render:calltemplate><%
                }
                                %></li><%
                                %></c:forEach><%
                %></ul>
</ia:root></cs:ftcs>