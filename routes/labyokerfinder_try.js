var pg = require("pg");
var moment = require('moment-timezone');
var MailOptions = require('../config/emailClient').MailOptions;
var MailOptionsWithCC = require('../config/emailClient').MailOptionsWithCC;
var config = require("../config/database");
var connectionString = process.env.DATABASE_URL || "pg://" + config.username + ":"
		+ config.password + "@" + config.host + ":" + config.port + "/"
		+ config.database;
console.log("connection db could be: " + process.env.DATABASE_URL);
console.log("connection db is: " + connectionString);
//pg.defaults.ssl = true;
var client = new pg.Client(connectionString);
//client.connect();
var crypt = require('bcrypt-nodejs');

LabYokeFinder = function(today) {
	this.now = today
};

LabYokeAgents = function(email) {
	this.email = email;
};

LabyokerCategories = function() {
};

LabyokerLabs = function(lab,adminemail) {
	this.adminemail = adminemail;
	this.lab = lab;
};

LabYokerChangeShare = function(table, agent, vendor,catalognumber,email,requestor,checked,datenow,date) {
	this.agent = agent;
	this.vendor = vendor;
	this.catalognumber = catalognumber;
	this.checked = checked;
	this.table = table;
	this.email = email;
	this.date = date;
	this.datenow = datenow;
	this.requestor = requestor;
};

LabyokerUserDetails = function(column, value, email,curname,cursurname) {
	this.column = column;
	this.value = value;
	this.email = email;
	this.curname = curname;
	this.cursurname = cursurname;
}

LabYokeReporterOrders = function(datefrom, dateto, lab, category) {
	this.datefrom = datefrom;
	this.dateto = dateto;
	this.lab = lab;
	this.category = category;
};

LabYokeReporterShares = function(datefrom, dateto, category) {
	this.datefrom = datefrom;
	this.dateto = dateto;
	this.agent = agent;
	this.category = category;
};

LabYokeReporterSavings = function(datefrom,dateto,agent,vendor,catalognumber,lab) {
	this.datefrom = datefrom;
	this.dateto = dateto;
	this.vendor = vendor;
	this.lab = lab;
	this.agent = agent;
	this.catalognumber = catalognumber;
};

LabyokerInit = function(email) {
	this.email = email;
};

LabYokeSearch = function(searchText, email) {
	this.searchText = searchText;
	this.email = email;
};

LabYokeUploader = function(jsonResults) {
	this.jsonResults = jsonResults;
};

LabyokerConfirm = function(registerid) {
	this.registerid = registerid;
};

LabYokerOrder = function(lab,agent,vendor,catalognumber,email,location,sendemail,category,quantity) {
	this.agent = agent;
	this.vendor = vendor;
	this.catalognumber = catalognumber;
	this.email = email;
	this.location = location;
	this.sendemail = sendemail;
	this.category = category;
	this.lab = lab;
	this.quantity = quantity;
};

LabYokerGetOrder = function(sendemail,lab) {
	this.sendemail = sendemail;
	this.lab = lab;
};

LabyokerRegister = function(user, password,lab,firstname,lastname,email,tel) {
	this.username = user;
	this.password = password;
	this.lab = lab;
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.tel = tel;
};

LabyokerPasswordChange = function(hash, password) {
	this.hash = hash;
	this.password = password;

};

LabYokeUploader.prototype.upload = function(callback) {
	var results = this.jsonResults;
	console.log("location: " + location);
	var values = "";
	var now = moment(new Date).tz("America/New_York").format('MM-DD-YYYY');

	if(results != null){
		for(var prop in results){
			var agent = results[prop].name_of_reagent;
			var vendor = results[prop].vendor;
			var catalognumber = results[prop].catalog_number;
			var location = results[prop].location;
			var email = results[prop].user;
			var category = results[prop].category;
			var price = results[prop].price;
			values = values + "('" + agent
		+ "', '" + vendor + "', '" + catalognumber + "', '" + location + "', '" + email + "','" + now + "','" + category + "','new',0,1,''," + price + ")";
			if(prop < (results.length-1)){
				values = values + ",";
			}
		}
	}
	console.log("values " + values);
pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

	if(values!= null){
		var query2 = client.query("INSERT INTO vm2016_agentsshare VALUES " + values);

		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			console.log("successfulUpload");
			callback(null, "successfulUpload");
			
			pg.end();
		});
			
	} else {
		//Change Password already sent
		console.log("cannotUploadMissingData.");
		callback(null, "cannotUploadMissingData");
		pg.end();

	}

});
};

LabYokeReporterSavings.prototype.dataMoney = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	var vendor = this.vendor;
	var lab = this.lab;
	var agent = this.agent;
	var catalognumber = this.catalognumber;
	var selected = "a.category, count(a.category) as counting, b.lab, a.price";
	var where = "a.agent = b.agent and a.catalognumber = b.catalognumber ";
	var groupby = "a.category, b.lab, a.price";
	console.log("report on savings- datefrom: " + datefrom);
	console.log("report on savings- dateto: " + dateto);
	var query;

	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.date";
		if(where.length>0)
			where +=" and ";
		where += "b.date between '" + datefrom + "' and '" + dateto + "'";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.date";
	} else {
		datefrom = "all";
	}

	if(lab != null && lab !=undefined && lab !="all"){
		if(where.length>0)
			where +=" and ";
		where += "b.lab = '" + lab + "'";
	} 

	if(agent != null && agent !=undefined && agent !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.agent";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.agent";
	} 
	if(vendor != null && vendor !=undefined && vendor !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.vendor";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.vendor";
	}
	if(catalognumber != null && catalognumber !=undefined && catalognumber !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.catalognumber";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.catalognumber";
	}

	var qrstr = "SELECT " + selected + " from vm2016_agentsshare a, vm2016_orders b where " + where + " group by " + groupby + " order by a.category asc";
	console.log("qrstr = " + qrstr);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	query = client.query(qrstr);

	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		var savings = 0;
		if(results != null && results != ""){
			console.log("data money: " + results);
			for(var prop in results){
				savings += results[prop].counting * results[prop].price;
			}
		}
		callback(null, savings);
		pg.end();
	});
});
};

LabYokeReporterSavings.prototype.reportMoney = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	var vendor = this.vendor;
	var lab = this.lab;
	var agent = this.agent;
	var catalognumber = this.catalognumber;
	var selected = "a.category, count(a.category) as counting, b.lab, a.price";
	var where = "a.agent = b.agent and a.catalognumber = b.catalognumber ";
	var groupby = "a.category, b.lab, a.price";
	var params = "";
	var columns ="<td>Category</td><td>Lab</td>";
	var html = "<div><span style='font-weight:bold;font-size:36pt;margin-bottom:20px;float:left'>Savings.</span></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px; width:50%;float:left\">"
				+ "";
	console.log("report on savings- datefrom: " + datefrom);
	console.log("report on savings- dateto: " + dateto);
	var query;

	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Date From: </span><span>" + moment(datefrom).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY')  + "</span></div>";
		params += "<div><span style='font-weight:bold'>Date To: </span><span>" + moment(dateto).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY')  + "</span></div>";
		if(selected.length>0)
			selected +=", ";
		selected += "b.date";
		if(where.length>0)
			where +=" and ";
		where += "b.date between '" + datefrom + "' and '" + dateto + "'";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.date";
		html += "<p'>This report is listing savings between " + moment(datefrom).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + " and " + moment(dateto).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + "</p></div>"
	} else {
		datefrom = "all";
		html += "<p>This report is listing all savings:</p></div>"
	}

	if(lab != null && lab !=undefined && lab !="all"){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Lab: </span><span>" + lab + "</span></div>";
		if(where.length>0)
			where +=" and ";
		where += "b.lab = '" + lab + "'";
	} 

	if(agent != null && agent !=undefined && agent !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.agent";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.agent";
		columns+="<td>Reagent</td>";
	} 
	if(vendor != null && vendor !=undefined && vendor !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.vendor";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.vendor";
		columns+="<td>Vendor</td>";
	}
	if(catalognumber != null && catalognumber !=undefined && catalognumber !=""){
		if(selected.length>0)
			selected +=", ";
		selected += "b.catalognumber";
		if(groupby.length>0)
			groupby +=" , ";
		groupby += "b.catalognumber";
		columns+="<td>Catalog#</td>";
	}
	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		columns+="<td>Date</td>";
	}
	/*if(selected.length>0)
		selected +=", ";
	selected +="count(a.category)";*/
	columns+="<td>Shares Savings</td>";
	var qrstr = "SELECT " + selected + " from vm2016_agentsshare a, vm2016_orders b where " + where + " group by " + groupby + " order by a.category asc";
	console.log("qrstr = " + qrstr);

pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	query = client.query(qrstr);

	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		html += params;
		var savings = 0;
		if(results != null && results != ""){
		html +="<table style='margin-top:100px;float:left><tbody><tr style='color: white;background-color: #3d9dcb;font-size:12px'>" + columns + "</tr>"
		
			for(var prop in results){

				html += "<tr>" + "<td style='font-size: 12px;'>" + results[prop].category + "</td>" + "<td style='font-size: 12px;'>" + results[prop].lab + "</td>";

				if(agent != null && agent !=undefined && agent !=""){
				html += "<td style='font-size: 12px;'>" + results[prop].agent + "</td>";
				}
				if(vendor != null && vendor !=undefined && vendor !=""){
				html += "<td style='font-size: 12px;'>" + results[prop].vendor + "</td>";
				}
				if(catalognumber != null && catalognumber !=undefined && catalognumber !=""){
				html += "<td style='font-size: 12px;'>" + results[prop].catalognumber + "</td>";
				}
				if(datefrom != null && datefrom !=undefined && datefrom !="" && dateto != null && dateto !=undefined && dateto !="" ){
				html += "<td style='font-size: 12px;'>" + moment(results[prop].date).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY')+ "</td>";
				}
				var total = results[prop].counting * results[prop].price;
				savings += total;
				html += "<td style='font-size: 12px;'>" + total + "</td>";
				html += " </tr>";
		
			}
			html += "</tbody></table><div>The <span style='font-weight:bold'>Total</span> savings are <span style='font-size:30pt'>$" + savings + ".</span></div><br/><p style='margin-top:50px'><i><b>The LabYoke Team.</b></i></p><img style='width: 150px; margin: 0 20px;float:left' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/>";
			console.log("html money: " + html);
		}
		
		callback(null, html);
		pg.end();
	});
});
};

LabYokeReporterShares.prototype.reportShares = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	var category = this.category;
	var params = "";
	var where = "";
	console.log("report on something: datefrom: " + datefrom);
	console.log("report on something: dateto: " + dateto);
	console.log("report on something: agent: " + agent);
	var query;
	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Date From: </span><span>" + datefrom + "</span></div>";
		params += "<div><span style='font-weight:bold'>Date To: </span><span>" + dateto + "</span></div>";
		if(where == "")
			where =" where ";
		where += "date between '" + datefrom + "' and '" + dateto + "'";
	} else {
		datefrom = "all";
	}
	if(category != null && category !=undefined && category !="all"){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Category: </span><span>" + category + "</span></div>";
		if(where == ""){
			where =" where ";
		}
		if(where.trim() != "where")
			where +=" and ";
		where += " lower(category) like '%" + category.toLowerCase() + "%'";
	} 
	var qryStr = "SELECT * FROM vm2016_agentsshare " + where + " order by date desc";
	console.log("query report shares: " + qryStr);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	query = client.query(qryStr);

	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		var html = "";
		if(results != null && results != ""){
		html = "<div><span style='font-weight:bold;font-size:36pt;margin-bottom:20px;float:left'>Inventory.</span></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px; width:50%;float:left\">";

		if(datefrom == 'all'){
			html += "<p>This report is listing all the inventory uploaded:</p></div>"
		} else {
			html += "<p>This report is listing the inventory uploaded between " + moment(datefrom).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + " and " + moment(dateto).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + "</p></div>"
		}
		html += params;
		html +="<table><tbody><tr style='color: white;background-color: #3d9dcb;'><td style='font-size: 12px;'>Reagent</td><td style='font-size: 12px;'>Lab</td><td style='font-size: 12px;'>Vendor</td><td style='font-size: 12px;'>Catalog#</td><td style='font-size: 12px;'>Location</td><td style='font-size: 12px;'>User</td><td style='font-size: 12px;'>Category</td><td>Date</td></tr>"
		
			for(var prop in results){
				var agent = results[prop].agent;
				var vendor = results[prop].vendor;
				var catalognumber = results[prop].catalognumber;
				var location = results[prop].location;
				var email = results[prop].email;
				var category = results[prop].category;
				var labrow = results[prop].lab;
				var date = results[prop].date;

				html += " <tr><td style='font-size: 12px;'>" + agent + "</td>";
				html += " <tr><td style='font-size: 12px;'>" + labrow + "</td>";
				html += " <td style='font-size: 12px;'>" + vendor + "</td>";
				html += " <td style='font-size: 12px;'>" + catalognumber + "</td>";
				html += " <td style='font-size: 12px;'>" + location + "</td>";
				html += " <td style='font-size: 12px;'>" + email + "</td>";
				html += " <td style='font-size: 12px;'>" + category + "</td>";
				html += " <td style='font-size: 12px;'>" + moment(date).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + "</td></tr>";
		
			}
			html += "</tbody></table><p><i><b>The LabYoke Team.</b></i></p><img style='width: 150px; margin: 0 20px;float:left' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/>";
		}
		
		callback(null, html);
		pg.end();
	});
});
};

LabYokeReporterOrders.prototype.reportOrders = function(callback) {
	var results;
	var datefrom = this.datefrom;
	var dateto = this.dateto;
	var lab = this.lab;
	var category = this.category;
	var params = "";
	var where = "";
	console.log("report on something: datefrom: " + datefrom);
	console.log("report on something: dateto: " + dateto);
	console.log("report on something: lab: " + lab);
	console.log("report on something: category: " + category);
	var query;

	if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Date From: </span><span>" + datefrom + "</span></div>";
		params += "<div><span style='font-weight:bold'>Date To: </span><span>" + dateto + "</span></div>";
		if(where == "")
			where =" where ";
		where += "date between '" + datefrom + "' and '" + dateto + "'";
	} else {
		datefrom = "all";
	}
	if(lab != null && lab !=undefined && lab !="all"){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Lab: </span><span>" + lab + "</span></div>";
		if(where == "")
			where =" where ";
		if(where.trim() != "where")
			where +=" and ";
		where += "lab = '" + lab + "'";
	} 
	if(category != null && category !=undefined && category !="all"){
		if(params == ""){
			params += "<div style='font-weight:bold'>Parameters</div>";
		}
		params += "<div><span style='font-weight:bold'>Category: </span><span>" + category+ "</span></div>";
		if(where == "")
			where =" where ";
		if(where.trim() != "where")
			where +=" and ";
		where += " lower(category) like '%" + category.toLowerCase()  + "%'";
	} 
	var qryStr = "SELECT * FROM vm2016_orders " + where + " order by date desc";
	console.log("qry report orders: " + qryStr)
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	query = client.query(qryStr);
	/*if(datefrom != null && dateto != null && datefrom !=undefined && dateto !=undefined && datefrom !="" && dateto !=""){
		query = client.query("SELECT * FROM vm2016_orders where date between '" + datefrom + "' and '" + dateto + "' order by date desc");
	} else {
		query = client.query("SELECT * FROM vm2016_orders order by date desc");
		datefrom = "all";
	}*/
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("results : " + results);
		var html = "";
		if(results != null && results != ""){
		html = "<div><span style='font-weight:bold;font-size:36pt;margin-bottom:20px;float:left'>Orders.</span></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px; width:50%;float:left\">";
		if(datefrom == 'all'){
			html += "<p>This report is listing all the orders requested:</p></div>"
		} else {
			html += "<p>This report is listing the orders requested between " + moment(datefrom).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + " and " + moment(dateto).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + "</p></div>"
		}
		html += params;
		html +="<table><tbody><tr style='color: white;background-color: #3d9dcb;'><td style='font-size: 12px;'>Reagent</td><td style='font-size: 12px;'>Vendor</td><td style='font-size: 12px;'>Catalog#</td><td style='font-size: 12px;'>Owner</td><td style='font-size: 12px;'>Requestor</td><td>Date</td></tr>"
		
			for(var prop in results){
				var agent = results[prop].agent;
				var vendor = results[prop].vendor;
				var catalognumber = results[prop].catalognumber;
				var location = results[prop].email;
				var email = results[prop].requestoremail;
				var date = results[prop].date;


				html += " <tr><td style='font-size: 12px;'>" + agent + "</td>";
				html += " <td style='font-size: 12px;'>" + vendor + "</td>";
				html += " <td style='font-size: 12px;'>" + catalognumber + "</td>";
				html += " <td style='font-size: 12px;'>" + location + "</td>";
				html += " <td style='font-size: 12px;'>" + email + "</td>";
				html += " <td style='font-size: 12px;'>" + moment(date).add(1, 'day').tz("America/New_York").format('MM-DD-YYYY') + "</td></tr>";
		
			}
			html += "</tbody></table><p><i><b>The LabYoke Team.</b></i></p><img style='width: 150px; margin: 0 20px;float:left' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/>";
		}
		
		callback(null, html);
		pg.end();
	});
});
};

LabYokeAgents.prototype.getLabyoker = function(callback) {
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM vm2016_users where email='" + this.email
			+ "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("get user details " + results);
		callback(null, results);
		pg.end();
	});
});
};

LabyokerLabs.prototype.getlabs = function(callback) {
	var results;
	var lab = this.lab;
	var adminemail = this.adminemail;
	var where = "";
	console.log("get lab " + lab);
	console.log("get admin " + adminemail);
	if(adminemail != null && adminemail.length>0){
		where = " where admin='" + adminemail + "'";
	}
	if(lab != null && lab.length>0){
		where = " where lab='" + lab + "'";
	}
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM labs" + where);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("get labs results" + results);
		callback(null, results);
		pg.end();
	});
});
};

LabYokeAgents.prototype.findmyshares = function(callback) {
	var results = [];
	console.log("findmyshares: " + this.email);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT * FROM vm2016_agentsshare where email='"
					+ this.email + "' order by date desc");
	var email = this.email;
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client
				.query("SELECT a.category, count(a.category) from vm2016_agentsshare a, vm2016_orders b where a.agent = b.agent and a.catalognumber = b.catalognumber and b.email='"
					+ email + "' group by a.category order by a.category asc");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);
			var query4 = client.query("SELECT * from vm2016_orders where email='" + email
				+ "' order by date desc");
			query4.on("row", function(row, result4) {
				result4.addRow(row);
			});
			query4.on("end", function(result4) {
				var test4 = result4.rows;
				results.push(test4.length);
				results.push(test4);
				var query3 = client
					.query("update vm2016_orders set status='' where status='new' and email='" + email
				+ "'");

				query3.on("row", function(row, result3) {
					result3.addRow(row);
				});
				query3.on("end", function(result3) {
					var query5 = client
						.query("SELECT category, count(category) as counting, EXTRACT(MONTH FROM date_trunc( 'month', date )) as monthorder, EXTRACT(year FROM date_trunc( 'year', date )) as yearorder from vm2016_orders where email='" + email
					+ "' group by category, date_trunc( 'month', date ), date_trunc( 'year', date ) order by category asc");
					query5.on("row", function(row, result5) {
						result5.addRow(row);
					});
					query5.on("end", function(result5) {
						results.push(result5.rows);
						console.log("orders findmyshares result5: " + result5.rows)
						callback(null, results);
						pg.end();
					});
				});

			});
			//callback(null, results)
		});
	});
});
};

LabYokeAgents.prototype.reportAllSharesByCategory = function(callback) {
	var results;
	console.log("reportAllSharesByCategory: " + this.email);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT b.category, count(b.category) FROM vm2016_orders a, vm2016_agentsshare b where a.agent = b.agent group by b.category");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
		pg.end();
	});
});
};

LabyokerCategories.prototype.getcategories = function(callback) {
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT distinct category FROM vm2016_agentsshare");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
		pg.end();
	});
});
};



LabYokerOrder.prototype.order = function(callback) {
	var results;
	var agent = this.agent;
	var vendor = this.vendor;
	var catalognumber = this.catalognumber;
	var email = this.email;
	var sendemail = this.sendemail;
	var location = this.location;
	var category = this.category;
	var lab = this.lab;
	var quantity = this.quantity;
	console.log("quantity: " + quantity);
	quantity = quantity + 100;
	console.log("currentquantity2: " + quantity);
	var now = moment(new Date).tz("America/New_York").format('MM-DD-YYYY');
	console.log("order location: " + location);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("INSERT INTO vm2016_orders VALUES ('" + agent + "', '" + vendor + "', '" + catalognumber + "','" + email + "', '" + sendemail + "', '" + now + "', 'new', '" + category + "','" + lab + "',1 )");

	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;

		var subject = "LabYoke - Pending Order for " + agent;
		var subjectReq = "LabYoke - Your Request to order " + agent;
		var body = "<div style='text-align:center'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;float:left\">Hello " + location
				+ ",<br/><br/>";
		var bodyReq = "<div style='text-align:center'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;float:left\">Hello,<br/><br/>";
		body += "This is a kind request to share 100 units from the following inventory:";
		bodyReq += "You have requested 100 units from the following inventory:";
		body += "<br><b>Agent: </b> " + agent;
		bodyReq += "<br><b>Agent: </b> " + agent;
		body += "<br><b>Vendor: </b> " + vendor;
		bodyReq += "<br><b>Vendor: </b> " + vendor;
		body += "<br><b>Catalog#: </b> " + catalognumber;
		bodyReq += "<br><b>Catalog#: </b> " + catalognumber;
		body += "<br><b>Owner: </b> " + email;
		bodyReq += "<br><b>Owner: </b> " + email;
		body += "<br><b>Lab: </b> " + lab;
		bodyReq += "<br><b>Lab: </b> " + lab;
		body += "<p>Best regards,";
		bodyReq += "<p>Best regards,";
		body += "</p><b><i>The LabYoke Team.</i></b></div>";
		bodyReq += "</p><b><i>The LabYoke Team.</i></b></div>";
		console.log("order body: " + body);
		var tes = "UPDATE vm2016_agentsshare SET quantity = " + quantity + " WHERE agent='" + agent + "' AND vendor='" + vendor + "' AND catalognumber='" + catalognumber + "' AND email='" + email + "'";
		console.log("order tes: " + tes);
		var query2 = client.query(tes);
		console.log("query2: " + query2);
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {

			var mailOptions = new MailOptionsWithCC(email, subject, body);
			var mailOptionsReq = new MailOptionsWithCC(sendemail, subjectReq, bodyReq);
			mailOptions.sendAllEmails();
			mailOptionsReq.sendAllEmails();

			callback(null, "successfulOrder");
			pg.end();
		});
	});
});
};

LabYokerGetOrder.prototype.getLabOrders = function(callback) {
	var results = [];
	console.log("getLabOrders");
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT lab, count(lab) as counting FROM vm2016_orders where lab='Sama Lab' group by lab");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client.query("SELECT lab, count(lab) as counting FROM vm2016_orders where lab='Sougnou Lab' group by lab");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);
			var query3 = client.query("SELECT lab, count(lab) as counting FROM vm2016_orders where lab='SeneLab' group by lab");
			query3.on("row", function(row, result3) {
				result3.addRow(row);
			});
			query3.on("end", function(result3) {
				results.push(result3.rows);
				callback(null, results);
				pg.end();
			});
		});

	});
});
};

LabYokerGetOrder.prototype.getLabOrders_2 = function(callback) {
	var results;
	console.log("getLabOrders");
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT lab, count(lab) as counting FROM vm2016_orders group by lab");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
		pg.end();
	});
});
};


LabYokerGetOrder.prototype.getorders = function(callback) {
	var results = [];
	var email = this.sendemail;
	var lab = this.lab;
	console.log("getorders: " + email);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT * FROM vm2016_orders where requestoremail = '"
					+ email + "' order by date desc");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client.query("SELECT b.category, count(b.category) FROM vm2016_orders b where b.lab='"+lab+"' and b.insufficient=1 group by b.category");
		//("SELECT b.category, count(b.category) FROM vm2016_orders a, vm2016_agentsshare b where a.agent = b.agent and a.lab='"+lab+"' group by b.category");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);

		var query3 = client
				.query("SELECT count(agent) as counting from vm2016_agentsshare where email='" + email
			+ "' and status='new' ");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			//results.push(result2.rows);
		var query4 = client.query("SELECT category, count(category) as counting, EXTRACT(MONTH FROM date_trunc( 'month', date )) as monthorder, EXTRACT(year FROM date_trunc( 'year', date )) as yearorder from vm2016_orders where requestoremail='" + email
			+ "' group by category, date_trunc( 'month', date ), date_trunc( 'year', date ) order by category asc");
		query4.on("row", function(row, result4) {
			result4.addRow(row);
		});
		query4.on("end", function(result4) {
			//results.push(result2.rows);
			var test3 = result3.rows;

			results.push(test3[0].counting);
			results.push(result4.rows);
			console.log("shares found: " + test3[0].counting)

			var query5 = client.query("SELECT a.category, count(a.category) FROM vm2016_orders a, vm2016_users b where b.lab='"+lab+"' and a.insufficient=1 and a.requestoremail=b.email group by a.category");
		query5.on("row", function(row, result5) {
			result5.addRow(row);
		});
		query5.on("end", function(result5) {
			results.push(result5.rows);
			callback(null, results);
			pg.end();
			});

		});

		});

			//callback(null, results)
		});
	});
});

};

LabYokeSearch.prototype.search = function(callback) {
	var results = [];
	console.log("searchText: " + this.searchText);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT * FROM vm2016_agentsshare a, vm2016_users b where a.email = b.email and lower(a.agent) like lower('%"
					+ this.searchText + "%') and a.insufficient = 1 and a.email != '" + this.email+ "' order by a.agent");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results.push(result.rows);
		var query2 = client.query("SELECT distinct agent FROM vm2016_agentsshare");
		
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			results.push(result2.rows);
				callback(null, results);
				pg.end();
		});
		//callback(null, results)
	});
});
};

LabYokeSearch.prototype.findagents = function(callback) {
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT distinct agent FROM vm2016_agentsshare");
	
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
			callback(null, results);
			pg.end();
	});
});
};

//var crypt = require('bcrypt-nodejs');
var salt = crypt.genSaltSync(1);

Labyoker = function(username, password) {
	this.username = username;
	this.password = password;

};

LabYokeFinder.prototype.getLabyoker = function(callback) {
	var results;
pg.connect(connectionString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM vm2016_users where id='" + id
			+ "' and password='" + password + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
		pg.end();
	});
});
};

LabYokeFinder.prototype.test = function(callback) {
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM vm2016_users where id='"
			+ this.username + "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		callback(null, results);
		pg.end();
	});
});
	// return false;
};

LabyokerInit.prototype.initialShares = function(callback) {
	var email = this.email;
console.log("shares email: " + email);
	var resultsLogin;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
		var query = client
				.query("SELECT count(agent) as counting from vm2016_orders where email='" + email
			+ "' and status='new'");
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			var test = result.rows;
			//resultsLogin.push(results);
			resultsLogin=test[0].counting;
			console.log("shares found: " + test[0].counting)
			callback(null, resultsLogin);
			pg.end();
			//results.push(result2.rows);

		/*var query3 = client
				.query("SELECT count(agent) as counting from vm2016_orders where requestoremail='" + email
			+ "' and status='new'");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			//results.push(result2.rows);
			var test3 = result3.rows;
			var test2 = result2.rows;
			//resultsLogin.push(results);
			resultsLogin.push(test2[0].counting);
			resultsLogin.push(test3[0].counting);
			console.log("shares found: " + test2[0].counting)
			console.log("orders found: " + test3[0].counting)
			callback(null, resultsLogin)
		});*/
			

					//callback(null, results);
	});
});
};

LabyokerInit.prototype.initialOrders = function(callback) {
	var email = this.email;

	var resultsLogin;
console.log("orders email: " + email);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
var query = client
				.query("SELECT count(agent) as counting from vm2016_orders where requestoremail='" + email
			+ "' and status='new'");
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			//results.push(result2.rows);
			var test = result.rows;
			//resultsLogin.push(results);
			resultsLogin = test[0].counting;
			console.log("orders found: " + test[0].counting)
			callback(null, resultsLogin)
			pg.end();
		});
});		

};

Labyoker.prototype.login = function(callback) {
	var password = this.password;
	var username = this.username;

	var results;
	var resultsLogin = [];
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM vm2016_users where id='" + username
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		if (results != null && results.length == 1) {
			resultsLogin.push(results);
			var pass = results[0].password;
			var active = results[0].active;
			var email = results[0].email;
			console.log("email is: " + results[0].email);
			// var hash = crypt.hashSync(pass, salt);
			//if (active == 1) {
				var c = crypt.compareSync(password, pass);
				console.log("compare is: " + c);
				if (c) {

		/*var query2 = client
				.query("SELECT count(agent) as counting from vm2016_orders where email='" + email
			+ "' and status='new'");
		query2.on("row", function(row, result2) {
			result2.addRow(row);
		});
		query2.on("end", function(result2) {
			//results.push(result2.rows);

		var query3 = client
				.query("SELECT count(agent) as counting from vm2016_orders where requestoremail='" + email
			+ "' and status='new'");
		query3.on("row", function(row, result3) {
			result3.addRow(row);
		});
		query3.on("end", function(result3) {
			//results.push(result2.rows);
			var test3 = result3.rows;
			var test2 = result2.rows;
			//resultsLogin.push(results);
			resultsLogin.push(test2[0].counting);
			resultsLogin.push(test3[0].counting);
			console.log("shares found: " + test2[0].counting)
			console.log("orders found: " + test3[0].counting)*/
			callback(null, resultsLogin)
			pg.end();
		/*});
			
		});*/

					//callback(null, results);
				} else {
					callback(null, null);
					pg.end();
				}
			/*} else {
				var query = client
						.query("SELECT * FROM vm2016_users where id='"
								+ username + "'");
				query.on("row", function(row, result) {
					result.addRow(row);
				});
				query.on("end", function(result) {
					callback(null, result.rows);
				});
			}*/
		} else {
			callback(null, null);
			pg.end();
		}
	});
});
};

LabyokerPasswordChange.prototype.checkIfChangePassword = function(callback) {
	var results;
	var now = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
	var pwd = this.password;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT * FROM vm2016_users where changepwd_id='"
					+ this.hash + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;

		if (results != null && results.length == 1){
			var changepwd_date = results[0].changepwd_date;
			if(changepwd_date != null) {
		
		console.log("now is " + now);
		console.log("changepwd_date is " + ( changepwd_date == now));
			/*var query2 = client.query("SELECT * FROM vm2016_users where changepwd_id='"
				+ this.id + "' and changepwd_date like '" + now + "'");
			*/
			if(now == results[0].changepwd_date){
			var email = results[0].email;
			var name = results[0].name;
			var userid = results[0].id;

			/*query2.on("row", function(row, result2) {
				result2.addRow(row);
			});
			query2.on("end", function(result2) {
				results2 = result2.rows;
				if (results2 != null && results2.length == 1) {*/
					console.log("changing password now for: " + name);
					console.log("changing password pwd: " + pwd);
					var hash_new_password = crypt.hashSync(pwd);
					console.log("test0 " + hash_new_password);
					var query3 = client.query("UPDATE vm2016_users SET password='" + hash_new_password
							+ "', active=1, changepwd_date='', changepwd_status=1, changepwd_id='' where id='" + userid + "'");
					console.log("test1");
					query3.on("row", function(row, result3) {
						result3.addRow(row);
						console.log("test2");
					});
					console.log("changing password pwd: " + pwd);
					query3.on("end", function(result3) {
						var results3 = result3.rows;
						if (results3 != null) {
							var results3 = result3.rows;
							callback(null, "passwordReset");
							pg.end();
						} else {
							callback(null, "errorFound");
							pg.end();
						}
					});
				} else {
					callback(null, "dateExpired");
					pg.end();
				}
			//});
		} else {
			callback(null, "cannotFindRequest");
			pg.end();
		}
	}
	});
});
}

LabyokerRegister.prototype.register = function(callback) {
	var username = this.username;
	var password = this.password;
	var lab = this.lab;
	var firstname = this.firstname;
	var lastname = this.lastname;
	var email = this.email;
	var tel = this.tel;

	var results;
	//var check = 

			console.log("labyoker username: " + username);
			console.log("labyoker password: " + password);
			console.log("labyoker lab: " + lab);
			console.log("labyoker firstname: " + firstname);
			console.log("labyoker lastname: " + lastname);
			console.log("labyoker email: " + email);
			console.log("labyoker tel: " + tel);

pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	if(tel != null && tel.length>0 && username != null && username.length>0 && firstname != null && firstname.length>0 && lastname != null && lastname.length>0 && email != null && email.length>0 && password != null && password.length>0 && lab != null && lab.length>0 ){
	console.log("processing registration2...");
	//var query = client.query("SELECT * FROM vm2016_users where id='" + username
	//		+ "'"/* and password='"+password+"'" */);
	/*query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("email entered: " + email);
		if (results != null && results.length > 0) {
			
			for (i = 0; i < results.length; i++) { 
				console.log("results[i].email: " + results[i].email);
				if(results[i].email == email){
					console.log("in use?: alreadyInUse");
					callback(null, "alreadyInUse");
				}
			}

		} else {*/
				var hash_register_id = crypt.hashSync(username);
				console.log("before registerid: " + hash_register_id);
				hash_register_id = hash_register_id.replace(/\//g, "");
				console.log("registerid: " + hash_register_id);
			var hash = crypt.hashSync(password);
			var query2 = client.query("INSERT INTO vm2016_users VALUES ('" + username
				+ "', '" + hash + "', '" + firstname + "',  0, null, null, '" + email + "', null, '" + lab + "', '" + lastname + "', '" + tel + "', 0, '','" + hash_register_id + "')");

				query2.on("row", function(row, result2) {
					result2.addRow(row);
				});
				query2.on("end", function(result2) {

					
					console.log("email: " + email);

					/*if (email.length == 4 || email.length == 2) {
						email += "@netlight.com";
					}*/
					var subject = "Labyoke - Start Labyoking";
					var body = "<div style='text-align:center'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;float:left\">Hello " + firstname
							+ ",<br/><br/>";
					body += "Thanks for registering with @LabYoke.";
					body += "You are one step away from labyoking! Please click on this link:<br/>";
					body += "<p style=\"text-align:center\"><span style=''><b><a href='https:\/\/team-labyoke.herokuapp.com\/confirmreg/"
							+ hash_register_id + "'>https:\/\/team-labyoke.herokuapp.com\/confirmreg?id="
							+ hash_register_id
							+ "</a></b></span></p>";
					body += "<p>[PS: Start <a href=\"https:\/\/team-labyoke.herokuapp.com\/share\">sharing</a> some chemicals today?]";
					body += "</p><b><i>The LabYoke Team.</i></b></div>";
					console.log("body: " + body);

					var mailOptions = new MailOptions(email, subject, body);
					mailOptions.sendAllEmails();

					callback(null, "success");
					pg.end();

				});
				
		//}
	//});
} else if(tel != null && tel.length>0 && firstname != null && firstname.length>0 && lastname != null && lastname.length>0 && email != null && email.length>0 ){
	var rendered = false;
	console.log("processing registration...");
	var query = client.query("SELECT * FROM vm2016_users where email='" + email
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("email entered: " + email);
		if (results != null && results.length > 0) {
			
			//for (i = 0; i < results.length; i++) { 
				console.log("results[0].email: " + results[0].email);
				if(results[0].email == email){
					rendered = true;
					console.log("in use?: alreadyInUse");
					callback(null, "alreadyInUse");
					pg.end();
				}
			//}

		}
		console.log("rendered: " + rendered);
		if(!rendered){
			callback(null, "firstsection");
			pg.end();
		}
	});

} else {
	callback(null, null);
	pg.end();
}
});
};

Labyoker.prototype.requestChangePassword = function(callback) {
	var username = this.username;
	var dateStripped = this.password;

	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("SELECT * FROM vm2016_users where id='" + username
			+ "'"/* and password='"+password+"'" */);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		console.log("dateStripped: " + dateStripped);
		if (results != null && results.length == 1 && dateStripped != null) {
			var changepwd_status = results[0].changepwd_status;
			var now = moment(new Date).tz("America/New_York").format(
				'MM-DD-YYYY');
			var changepwd_date = results[0].changepwd_date;
			console.log("diff: " + changepwd_date + " - " + now);
			if(changepwd_date == null || (changepwd_date != null && changepwd_date=='') || (changepwd_date != null && changepwd_date!=now)){
				var hash = crypt.hashSync(username);
				console.log("before requestChangePassword: " + hash);
				hash = hash.replace(/\//g, "");
				console.log("requestChangePassword: " + hash);
				var query2 = client.query("UPDATE vm2016_users SET changepwd_id='" + hash
				+ "', changepwd_status=0, changepwd_date='" + dateStripped + "' where id='" + username + "'");
				
				var email = results[0].email;
				var name = results[0].name;

				query2.on("row", function(row, result2) {
					result2.addRow(row);
				});
				query2.on("end", function(result2) {

					
					console.log("email: " + email);

					/*if (email.length == 4 || email.length == 2) {
						email += "@netlight.com";
					}*/
					var subject = "Labyoke - Change Password Request";
					var body = "<div style='text-align:center'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;float:left\">Hello " + name
							+ ",<br/><br/>";
					body += "You have requested to change your password @LabYoke. Please click on this link:<br/>";
					body += "<p style=\"text-align:center\"><span style=''><b><a href='https:\/\/team-labyoke.herokuapp.com\/changepassword/"
							+ hash + "'>https:\/\/team-labyoke.herokuapp.com\/changepassword?id="
							+ hash
							+ "</a></b></span></p>";
					body += "<p><span>You have <b><span style='color:red;'>1 day</span>"
							+ "</b> to change your password. But don't worry you can always send us another <a href=\"https:\/\/team-labyoke.herokuapp.com\/forgot\">request</a> once this one has expired.</span> </p>";
					body += "<p>[PS: Have you <a href=\"https:\/\/team-labyoke.herokuapp.com\/share\">shared</a> some chemicals today?]";
					body += "</p><b><i>The LabYoke Team.</i></b></div>";
					console.log("body: " + body);

					var mailOptions = new MailOptions(email, subject, body);
					mailOptions.sendAllEmails();

				});
				callback(null, results);
				pg.end();
			} else {
				//Change Password already sent
				console.log("alreadySent.");
				callback(null, "alreadySent");
				pg.end();
			}
		} else {
			callback(null, null);
			pg.end();
		}
	});
});
};

Labyoker.prototype.changepassword = function(callback) {
	var hash = crypt.hashSync(this.password);
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("UPDATE vm2016_users SET password='" + hash
			+ "', active=1 where id='" + this.username + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
		pg.end();
	});
});
};

LabyokerConfirm.prototype.confirm = function(callback) {
	var results;
	var registerid = this.registerid;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client
			.query("SELECT * FROM vm2016_users where register_id='"
					+ registerid + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;

		if (results != null && results.length == 1){
			var userid = results[0].id;
			console.log("confirm registration now for: " + userid);

			var query2 = client.query("UPDATE vm2016_users SET active=1, register_id='' where id='" + userid + "'");
			query2.on("row", function(row, result2) {
				result2.addRow(row);
			});
			console.log("confirming reg: " + registerid);
			query2.on("end", function(result2) {
				var results2 = result2.rows;
				if (results2 != null) {
					callback(null, "confirmReset");
					pg.end();
				} else {
					callback(null, "errorFound");
					pg.end();
				}
			});
		} else {
			callback(null, "cannotFindRequest");
			pg.end();
		}
	});
});
};

LabyokerUserDetails.prototype.changeDetails = function(callback) {
	var column = this.column;
	var value = this.value;
	var email = this.email;
	var curname = this.curname;
	var cursurname = this.cursurname;
	var results;
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query("UPDATE vm2016_users SET " + column + "='" + value
			+ "' where email='" + email + "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		var qStr = "";
		var where = "";
		var location = "";
		var name = curname;
		var surname = cursurname;
		var update = false;
		if(column == "name"){
			if(where==""){
				where = " where email='" + email + "'";
			}
			name = value.charAt(0);
			location = name.toUpperCase() + ". " + surname;
			console.log("location name: " + location);
			update = true;

		}
		if(column == "surname"){
			if(where==""){
				where = " where email='" + email + "'";
			}
			update = true;
			surname = value;
			name = name.charAt(0);
			location = name.toUpperCase() + ". " + surname;
			console.log("location surname: " + location);
		}
		if(update){
			qStr = "update vm2016_agentsshare set location='" + location + "' " + where;
			console.log("qstr changedetails update share tbl: " + qStr);
			var query2 = client.query(qStr);
			query2.on("row", function(row, result2) {
				result2.addRow(row);
			});
			query2.on("end", function(result2) {

			});

		}
		results = column + " to " + value;
		callback(null, results);
		pg.end();
	});
});
};

LabYokerChangeShare.prototype.cancelShare = function(callback) {
	var agent = this.agent;
	var vendor = this.vendor;
	var catalognumber = this.catalognumber;
	var checked = this.checked;
	var table = this.table;
	var email = this.email;
	var datenow = this.datenow;
	var requestor = this.requestor;
	var date = this.date;
	console.log("date2: " + date);
	console.log("requestor: " + requestor);
	var results;
	var orderonly = "";
	if(table == "vm2016_orders"){
		orderonly = " and requestoremail='" + requestor + "'";
	}

	var str = "UPDATE " + table + " SET insufficient=" + checked
			+ ", insuffdate='" + datenow + "' where date between '" + date + "' and '" + date + "' and agent='" + agent + "' and vendor='" + vendor + "' and catalognumber='" + catalognumber + "' and email='" + email + "'" + orderonly;
	console.log("str: " + str);
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
	var query = client.query(str);
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = "success";

		if(table == "vm2016_orders" && checked == 0){
			var subject = "LabYoke Order - Cancelled for " + agent;
			var body = "<div style='text-align:center'><img style='width: 150px; margin: 0 20px;' src='https:\/\/team-labyoke.herokuapp.com\/images\/yoke4.png', alt='The Yoke',  title='Yoke', class='yokelogo'/></div><div style=\"font-family:'calibri'; font-size:11pt;padding: 20px;float:left\">Hello,<br/><br/>";
			body += "Unfortunately your order has been cancelled due to insufficient quantities from the following inventory: <br><b>Agent: </b> " + agent;
			body += "<br><b>Vendor: </b> " + vendor;
			body += "<br><b>Catalog#: </b> " + catalognumber;
			body += "<br><b>Owner: </b> " + email;
			body += "<p>Best regards,";
			body += "</p><b><i>The LabYoke Team.</i></b></div>";
			console.log("order body: " + body);
			var mailOptions = new MailOptionsWithCC(requestor, subject, body, email);
			mailOptions.sendAllEmails();
		}

		callback(null, results);
		pg.end();
	});
});
//callback(null, results);
};

/*LabyokerUserDetails.prototype.changesurname = function(callback) {
	var surname = this.placeholder;
	var results;
	var query = client.query("UPDATE vm2016_users SET surname='" + surname
			+ "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
	});
};

LabyokerUserDetails.prototype.changetel = function(callback) {
	var tel = this.placeholder;
	var results;
	var query = client.query("UPDATE vm2016_users SET tel='" + tel
			+ "'");
	query.on("row", function(row, result) {
		result.addRow(row);
	});
	query.on("end", function(result) {
		results = result.rows;
		callback(null, results);
	});
};
*/

var analyze = function(matchresults, participantsResults) {
	for (var i = 0; i < participantsResults.length; i++) {
		var participant = participantsResults[i];
		var points = 0;
		var matchmargin = matchresults.scoretyp - matchresults.scorehemma;
		var participantmargin = participant.scoretyp - participant.scorehemma;
		var predictedteam = participant.predictedteam;
		var winner = matchresults.winner;

		if (predictedteam != winner) {
			points = 0;
		} else if (participant.scoretyp == matchresults.scoretyp
				&& participant.scorehemma == matchresults.scorehemma) {
			points = 6;
		} else if (predictedteam == winner && matchmargin == participantmargin
				&& matchresults.scorehemma != matchresults.scoretyp) {
			points = 4;
		} else if (predictedteam == winner
				|| (participant.scoretyp == matchresults.scoretyp && participant.scorehemma == matchresults.scorehemma)) {
			points = 3;
		}

		var email = participant.id;

		if (email.length == 4 || email.length == 2) {
			email += "@netlight.com";
		}
		var subject = "Your Prediction Results for - " + matchresults.typ
				+ " v " + matchresults.hemma;
		var body = "<div style=\"font-family:'calibri'; font-size:11pt\">Hello There,<br/><br/>";
		body += "Thanks for participating in the BrazilianLight tournament! Here is the result of the game:<br/>";
		body += "<p style=\"text-align:center\"><span style='font-size:20pt'><b>"
				+ matchresults.typ
				+ "</b></span> <span style='color:red; font-size:18pt'><b>"
				+ matchresults.scoretyp + "</b></span>";
		body += " v " + "<span style='color:red; font-size:18pt'><b>"
				+ matchresults.scorehemma
				+ "</b></span> <span style='font-size:20pt'><b>"
				+ matchresults.hemma + "</b></span></p>";
		body += "You predicted the score to be <b>" + participant.scoretyp
				+ ":" + participant.scorehemma + "</b>.";
		body += "<br/>You have earned: <span style='color:red'><b>" + points
				+ " points</b></span>.";
		body += "<br/><br/>Have you played today? Come and play with us again <a href=\"http:\/\/labyoke@gmail.com\">@BrazilianLight</a>";
		body += "<br/><br/><b><i>The BrazilianLight Team -</i></b></div>";

		var mailOptions = new MailOptions(email, subject, body);
		mailOptions.sendAllEmails();

		var results;
		var queryString = "UPDATE vm2014_predictsingleteam SET points = "
				+ points + " where bet = " + matchresults.bet + " and id = '"
				+ participant.id + "'";
pg.connect(connectionString, (err, client, done) => {
	    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
		var query = client.query(queryString);
		query.on("row", function(row, result) {
			result.addRow(row);
		});
		query.on("end", function(result) {
			results = result.rows;
			return results;
		});
});
	}
}

exports.Labyoker = Labyoker;
exports.LabyokerUserDetails = LabyokerUserDetails;
exports.LabYokeReporterOrders = LabYokeReporterOrders;
exports.LabYokeAgents = LabYokeAgents;
exports.LabYokeSearch = LabYokeSearch;
exports.LabyokerRegister = LabyokerRegister;
exports.LabYokerGetOrder = LabYokerGetOrder;
exports.LabYokerOrder = LabYokerOrder;
exports.LabYokeFinder = LabYokeFinder;
exports.LabYokeUploader = LabYokeUploader;
exports.LabyokerPasswordChange = LabyokerPasswordChange;
exports.LabYokerChangeShare = LabYokerChangeShare;
exports.LabyokerConfirm = LabyokerConfirm;
exports.LabyokerInit = LabyokerInit;
exports.LabyokerLabs = LabyokerLabs;
exports.LabYokeReporterSavings = LabYokeReporterSavings;
exports.LabYokeReporterShares = LabYokeReporterShares;
exports.LabyokerCategories = LabyokerCategories;