
import React, { Component } from 'react';
import ajaxWrapper from "base/ajax.js";
import Wrapper from 'base/wrapper.js';

import {Form, TextInput, Select, PasswordInput, Header, TextArea, NumberInput, DateTimePicker, Button, Checkbox} from 'library';
import TimeSelect from 'projectLibrary/timeSelect.js';
import {DateTime} from 'luxon';

var timezones = [{'text':'Africa/Abidjan', 'value':'Africa/Abidjan'},{'text':'Africa/Accra', 'value':'Africa/Accra'},{'text':'Africa/Addis_Ababa', 'value':'Africa/Addis_Ababa'},{'text':'Africa/Algiers', 'value':'Africa/Algiers'},{'text':'Africa/Asmara', 'value':'Africa/Asmara'},{'text':'Africa/Asmera', 'value':'Africa/Asmera'},{'text':'Africa/Bamako', 'value':'Africa/Bamako'},{'text':'Africa/Bangui', 'value':'Africa/Bangui'},{'text':'Africa/Banjul', 'value':'Africa/Banjul'},{'text':'Africa/Blantyre', 'value':'Africa/Blantyre'},{'text':'Africa/Brazzaville', 'value':'Africa/Brazzaville'},{'text':'Africa/Bujumbura', 'value':'Africa/Bujumbura'},{'text':'Africa/Cairo', 'value':'Africa/Cairo'},{'text':'Africa/Casablanca', 'value':'Africa/Casablanca'},{'text':'Africa/Ceuta', 'value':'Africa/Ceuta'},{'text':'Africa/Conakry', 'value':'Africa/Conakry'},{'text':'Africa/Dakar', 'value':'Africa/Dakar'},{'text':'Africa/Dar_es_Salaam', 'value':'Africa/Dar_es_Salaam'},{'text':'Africa/Djibouti', 'value':'Africa/Djibouti'},{'text':'Africa/Douala', 'value':'Africa/Douala'},{'text':'Africa/El_Aaiun', 'value':'Africa/El_Aaiun'},{'text':'Africa/Freetown', 'value':'Africa/Freetown'},{'text':'Africa/Gaborone', 'value':'Africa/Gaborone'},{'text':'Africa/Harare', 'value':'Africa/Harare'},{'text':'Africa/Johannesburg', 'value':'Africa/Johannesburg'},{'text':'Africa/Juba', 'value':'Africa/Juba'},{'text':'Africa/Kampala', 'value':'Africa/Kampala'},{'text':'Africa/Khartoum', 'value':'Africa/Khartoum'},{'text':'Africa/Kigali', 'value':'Africa/Kigali'},{'text':'Africa/Kinshasa', 'value':'Africa/Kinshasa'},{'text':'Africa/Lagos', 'value':'Africa/Lagos'},{'text':'Africa/Libreville', 'value':'Africa/Libreville'},{'text':'Africa/Lome', 'value':'Africa/Lome'},{'text':'Africa/Luanda', 'value':'Africa/Luanda'},{'text':'Africa/Lubumbashi', 'value':'Africa/Lubumbashi'},{'text':'Africa/Lusaka', 'value':'Africa/Lusaka'},{'text':'Africa/Malabo', 'value':'Africa/Malabo'},{'text':'Africa/Maputo', 'value':'Africa/Maputo'},{'text':'Africa/Maseru', 'value':'Africa/Maseru'},{'text':'Africa/Mbabane', 'value':'Africa/Mbabane'},{'text':'Africa/Mogadishu', 'value':'Africa/Mogadishu'},{'text':'Africa/Monrovia', 'value':'Africa/Monrovia'},{'text':'Africa/Nairobi', 'value':'Africa/Nairobi'},{'text':'Africa/Ndjamena', 'value':'Africa/Ndjamena'},{'text':'Africa/Niamey', 'value':'Africa/Niamey'},{'text':'Africa/Nouakchott', 'value':'Africa/Nouakchott'},{'text':'Africa/Ouagadougou', 'value':'Africa/Ouagadougou'},{'text':'Africa/Porto-Novo', 'value':'Africa/Porto-Novo'},{'text':'Africa/Sao_Tome', 'value':'Africa/Sao_Tome'},{'text':'Africa/Timbuktu', 'value':'Africa/Timbuktu'},{'text':'Africa/Tripoli', 'value':'Africa/Tripoli'},{'text':'Africa/Tunis', 'value':'Africa/Tunis'},{'text':'Africa/Windhoek', 'value':'Africa/Windhoek'},{'text':'America/Adak', 'value':'America/Adak'},{'text':'America/Anchorage', 'value':'America/Anchorage'},{'text':'America/Anguilla', 'value':'America/Anguilla'},{'text':'America/Antigua', 'value':'America/Antigua'},{'text':'America/Araguaina', 'value':'America/Araguaina'},{'text':'America/Argentina/Buenos_Aires', 'value':'America/Argentina/Buenos_Aires'},{'text':'America/Argentina/Catamarca', 'value':'America/Argentina/Catamarca'},{'text':'America/Argentina/ComodRivadavia', 'value':'America/Argentina/ComodRivadavia'},{'text':'America/Argentina/Cordoba', 'value':'America/Argentina/Cordoba'},{'text':'America/Argentina/Jujuy', 'value':'America/Argentina/Jujuy'},{'text':'America/Argentina/La_Rioja', 'value':'America/Argentina/La_Rioja'},{'text':'America/Argentina/Mendoza', 'value':'America/Argentina/Mendoza'},{'text':'America/Argentina/Rio_Gallegos', 'value':'America/Argentina/Rio_Gallegos'},{'text':'America/Argentina/Salta', 'value':'America/Argentina/Salta'},{'text':'America/Argentina/San_Juan', 'value':'America/Argentina/San_Juan'},{'text':'America/Argentina/San_Luis', 'value':'America/Argentina/San_Luis'},{'text':'America/Argentina/Tucuman', 'value':'America/Argentina/Tucuman'},{'text':'America/Argentina/Ushuaia', 'value':'America/Argentina/Ushuaia'},{'text':'America/Aruba', 'value':'America/Aruba'},{'text':'America/Asuncion', 'value':'America/Asuncion'},{'text':'America/Atikokan', 'value':'America/Atikokan'},{'text':'America/Atka', 'value':'America/Atka'},{'text':'America/Bahia', 'value':'America/Bahia'},{'text':'America/Bahia_Banderas', 'value':'America/Bahia_Banderas'},{'text':'America/Barbados', 'value':'America/Barbados'},{'text':'America/Belem', 'value':'America/Belem'},{'text':'America/Belize', 'value':'America/Belize'},{'text':'America/Blanc-Sablon', 'value':'America/Blanc-Sablon'},{'text':'America/Boa_Vista', 'value':'America/Boa_Vista'},{'text':'America/Bogota', 'value':'America/Bogota'},{'text':'America/Boise', 'value':'America/Boise'},{'text':'America/Buenos_Aires', 'value':'America/Buenos_Aires'},{'text':'America/Cambridge_Bay', 'value':'America/Cambridge_Bay'},{'text':'America/Campo_Grande', 'value':'America/Campo_Grande'},{'text':'America/Cancun', 'value':'America/Cancun'},{'text':'America/Caracas', 'value':'America/Caracas'},{'text':'America/Catamarca', 'value':'America/Catamarca'},{'text':'America/Cayenne', 'value':'America/Cayenne'},{'text':'America/Cayman', 'value':'America/Cayman'},{'text':'America/Chicago', 'value':'America/Chicago'},{'text':'America/Chihuahua', 'value':'America/Chihuahua'},{'text':'America/Coral_Harbour', 'value':'America/Coral_Harbour'},{'text':'America/Cordoba', 'value':'America/Cordoba'},{'text':'America/Costa_Rica', 'value':'America/Costa_Rica'},{'text':'America/Creston', 'value':'America/Creston'},{'text':'America/Cuiaba', 'value':'America/Cuiaba'},{'text':'America/Curacao', 'value':'America/Curacao'},{'text':'America/Danmarkshavn', 'value':'America/Danmarkshavn'},{'text':'America/Dawson', 'value':'America/Dawson'},{'text':'America/Dawson_Creek', 'value':'America/Dawson_Creek'},{'text':'America/Denver', 'value':'America/Denver'},{'text':'America/Detroit', 'value':'America/Detroit'},{'text':'America/Dominica', 'value':'America/Dominica'},{'text':'America/Edmonton', 'value':'America/Edmonton'},{'text':'America/Eirunepe', 'value':'America/Eirunepe'},{'text':'America/El_Salvador', 'value':'America/El_Salvador'},{'text':'America/Ensenada', 'value':'America/Ensenada'},{'text':'America/Fort_Wayne', 'value':'America/Fort_Wayne'},{'text':'America/Fortaleza', 'value':'America/Fortaleza'},{'text':'America/Glace_Bay', 'value':'America/Glace_Bay'},{'text':'America/Godthab', 'value':'America/Godthab'},{'text':'America/Goose_Bay', 'value':'America/Goose_Bay'},{'text':'America/Grand_Turk', 'value':'America/Grand_Turk'},{'text':'America/Grenada', 'value':'America/Grenada'},{'text':'America/Guadeloupe', 'value':'America/Guadeloupe'},{'text':'America/Guatemala', 'value':'America/Guatemala'},{'text':'America/Guayaquil', 'value':'America/Guayaquil'},{'text':'America/Guyana', 'value':'America/Guyana'},{'text':'America/Halifax', 'value':'America/Halifax'},{'text':'America/Havana', 'value':'America/Havana'},{'text':'America/Hermosillo', 'value':'America/Hermosillo'},{'text':'America/Indiana/Indianapolis', 'value':'America/Indiana/Indianapolis'},{'text':'America/Indiana/Knox', 'value':'America/Indiana/Knox'},{'text':'America/Indiana/Marengo', 'value':'America/Indiana/Marengo'},{'text':'America/Indiana/Petersburg', 'value':'America/Indiana/Petersburg'},{'text':'America/Indiana/Tell_City', 'value':'America/Indiana/Tell_City'},{'text':'America/Indiana/Valparaiso', 'value':'America/Indiana/Valparaiso'},{'text':'America/Indiana/Vevay', 'value':'America/Indiana/Vevay'},{'text':'America/Indiana/Vincennes', 'value':'America/Indiana/Vincennes'},{'text':'America/Indiana/Winamac', 'value':'America/Indiana/Winamac'},{'text':'America/Indianapolis', 'value':'America/Indianapolis'},{'text':'America/Inuvik', 'value':'America/Inuvik'},{'text':'America/Iqaluit', 'value':'America/Iqaluit'},{'text':'America/Jamaica', 'value':'America/Jamaica'},{'text':'America/Jujuy', 'value':'America/Jujuy'},{'text':'America/Juneau', 'value':'America/Juneau'},{'text':'America/Kentucky/Louisville', 'value':'America/Kentucky/Louisville'},{'text':'America/Kentucky/Monticello', 'value':'America/Kentucky/Monticello'},{'text':'America/Knox_IN', 'value':'America/Knox_IN'},{'text':'America/Kralendijk', 'value':'America/Kralendijk'},{'text':'America/La_Paz', 'value':'America/La_Paz'},{'text':'America/Lima', 'value':'America/Lima'},{'text':'America/Los_Angeles', 'value':'America/Los_Angeles'},{'text':'America/Louisville', 'value':'America/Louisville'},{'text':'America/Lower_Princes', 'value':'America/Lower_Princes'},{'text':'America/Maceio', 'value':'America/Maceio'},{'text':'America/Managua', 'value':'America/Managua'},{'text':'America/Manaus', 'value':'America/Manaus'},{'text':'America/Marigot', 'value':'America/Marigot'},{'text':'America/Martinique', 'value':'America/Martinique'},{'text':'America/Matamoros', 'value':'America/Matamoros'},{'text':'America/Mazatlan', 'value':'America/Mazatlan'},{'text':'America/Mendoza', 'value':'America/Mendoza'},{'text':'America/Menominee', 'value':'America/Menominee'},{'text':'America/Merida', 'value':'America/Merida'},{'text':'America/Metlakatla', 'value':'America/Metlakatla'},{'text':'America/Mexico_City', 'value':'America/Mexico_City'},{'text':'America/Miquelon', 'value':'America/Miquelon'},{'text':'America/Moncton', 'value':'America/Moncton'},{'text':'America/Monterrey', 'value':'America/Monterrey'},{'text':'America/Montevideo', 'value':'America/Montevideo'},{'text':'America/Montreal', 'value':'America/Montreal'},{'text':'America/Montserrat', 'value':'America/Montserrat'},{'text':'America/Nassau', 'value':'America/Nassau'},{'text':'America/New_York', 'value':'America/New_York'},{'text':'America/Nipigon', 'value':'America/Nipigon'},{'text':'America/Nome', 'value':'America/Nome'},{'text':'America/Noronha', 'value':'America/Noronha'},{'text':'America/North_Dakota/Beulah', 'value':'America/North_Dakota/Beulah'},{'text':'America/North_Dakota/Center', 'value':'America/North_Dakota/Center'},{'text':'America/North_Dakota/New_Salem', 'value':'America/North_Dakota/New_Salem'},{'text':'America/Ojinaga', 'value':'America/Ojinaga'},{'text':'America/Panama', 'value':'America/Panama'},{'text':'America/Pangnirtung', 'value':'America/Pangnirtung'},{'text':'America/Paramaribo', 'value':'America/Paramaribo'},{'text':'America/Phoenix', 'value':'America/Phoenix'},{'text':'America/Port_of_Spain', 'value':'America/Port_of_Spain'},{'text':'America/Port-au-Prince', 'value':'America/Port-au-Prince'},{'text':'America/Porto_Acre', 'value':'America/Porto_Acre'},{'text':'America/Porto_Velho', 'value':'America/Porto_Velho'},{'text':'America/Puerto_Rico', 'value':'America/Puerto_Rico'},{'text':'America/Rainy_River', 'value':'America/Rainy_River'},{'text':'America/Rankin_Inlet', 'value':'America/Rankin_Inlet'},{'text':'America/Recife', 'value':'America/Recife'},{'text':'America/Regina', 'value':'America/Regina'},{'text':'America/Resolute', 'value':'America/Resolute'},{'text':'America/Rio_Branco', 'value':'America/Rio_Branco'},{'text':'America/Rosario', 'value':'America/Rosario'},{'text':'America/Santa_Isabel', 'value':'America/Santa_Isabel'},{'text':'America/Santarem', 'value':'America/Santarem'},{'text':'America/Santiago', 'value':'America/Santiago'},{'text':'America/Santo_Domingo', 'value':'America/Santo_Domingo'},{'text':'America/Sao_Paulo', 'value':'America/Sao_Paulo'},{'text':'America/Scoresbysund', 'value':'America/Scoresbysund'},{'text':'America/Shiprock', 'value':'America/Shiprock'},{'text':'America/Sitka', 'value':'America/Sitka'},{'text':'America/St_Barthelemy', 'value':'America/St_Barthelemy'},{'text':'America/St_Johns', 'value':'America/St_Johns'},{'text':'America/St_Kitts', 'value':'America/St_Kitts'},{'text':'America/St_Lucia', 'value':'America/St_Lucia'},{'text':'America/St_Thomas', 'value':'America/St_Thomas'},{'text':'America/St_Vincent', 'value':'America/St_Vincent'},{'text':'America/Swift_Current', 'value':'America/Swift_Current'},{'text':'America/Tegucigalpa', 'value':'America/Tegucigalpa'},{'text':'America/Thule', 'value':'America/Thule'},{'text':'America/Thunder_Bay', 'value':'America/Thunder_Bay'},{'text':'America/Tijuana', 'value':'America/Tijuana'},{'text':'America/Toronto', 'value':'America/Toronto'},{'text':'America/Tortola', 'value':'America/Tortola'},{'text':'America/Vancouver', 'value':'America/Vancouver'},{'text':'America/Virgin', 'value':'America/Virgin'},{'text':'America/Whitehorse', 'value':'America/Whitehorse'},{'text':'America/Winnipeg', 'value':'America/Winnipeg'},{'text':'America/Yakutat', 'value':'America/Yakutat'},{'text':'America/Yellowknife', 'value':'America/Yellowknife'},{'text':'Antarctica/Casey', 'value':'Antarctica/Casey'},{'text':'Antarctica/Davis', 'value':'Antarctica/Davis'},{'text':'Antarctica/DumontDUrville', 'value':'Antarctica/DumontDUrville'},{'text':'Antarctica/Macquarie', 'value':'Antarctica/Macquarie'},{'text':'Antarctica/Mawson', 'value':'Antarctica/Mawson'},{'text':'Antarctica/McMurdo', 'value':'Antarctica/McMurdo'},{'text':'Antarctica/Palmer', 'value':'Antarctica/Palmer'},{'text':'Antarctica/Rothera', 'value':'Antarctica/Rothera'},{'text':'Antarctica/South_Pole', 'value':'Antarctica/South_Pole'},{'text':'Antarctica/Syowa', 'value':'Antarctica/Syowa'},{'text':'Antarctica/Troll', 'value':'Antarctica/Troll'},{'text':'Antarctica/Vostok', 'value':'Antarctica/Vostok'},{'text':'Arctic/Longyearbyen', 'value':'Arctic/Longyearbyen'},{'text':'Asia/Aden', 'value':'Asia/Aden'},{'text':'Asia/Almaty', 'value':'Asia/Almaty'},{'text':'Asia/Amman', 'value':'Asia/Amman'},{'text':'Asia/Anadyr', 'value':'Asia/Anadyr'},{'text':'Asia/Aqtau', 'value':'Asia/Aqtau'},{'text':'Asia/Aqtobe', 'value':'Asia/Aqtobe'},{'text':'Asia/Ashgabat', 'value':'Asia/Ashgabat'},{'text':'Asia/Ashkhabad', 'value':'Asia/Ashkhabad'},{'text':'Asia/Baghdad', 'value':'Asia/Baghdad'},{'text':'Asia/Bahrain', 'value':'Asia/Bahrain'},{'text':'Asia/Baku', 'value':'Asia/Baku'},{'text':'Asia/Bangkok', 'value':'Asia/Bangkok'},{'text':'Asia/Beirut', 'value':'Asia/Beirut'},{'text':'Asia/Bishkek', 'value':'Asia/Bishkek'},{'text':'Asia/Brunei', 'value':'Asia/Brunei'},{'text':'Asia/Calcutta', 'value':'Asia/Calcutta'},{'text':'Asia/Choibalsan', 'value':'Asia/Choibalsan'},{'text':'Asia/Chongqing', 'value':'Asia/Chongqing'},{'text':'Asia/Chungking', 'value':'Asia/Chungking'},{'text':'Asia/Colombo', 'value':'Asia/Colombo'},{'text':'Asia/Dacca', 'value':'Asia/Dacca'},{'text':'Asia/Damascus', 'value':'Asia/Damascus'},{'text':'Asia/Dhaka', 'value':'Asia/Dhaka'},{'text':'Asia/Dili', 'value':'Asia/Dili'},{'text':'Asia/Dubai', 'value':'Asia/Dubai'},{'text':'Asia/Dushanbe', 'value':'Asia/Dushanbe'},{'text':'Asia/Gaza', 'value':'Asia/Gaza'},{'text':'Asia/Harbin', 'value':'Asia/Harbin'},{'text':'Asia/Hebron', 'value':'Asia/Hebron'},{'text':'Asia/Ho_Chi_Minh', 'value':'Asia/Ho_Chi_Minh'},{'text':'Asia/Hong_Kong', 'value':'Asia/Hong_Kong'},{'text':'Asia/Hovd', 'value':'Asia/Hovd'},{'text':'Asia/Irkutsk', 'value':'Asia/Irkutsk'},{'text':'Asia/Istanbul', 'value':'Asia/Istanbul'},{'text':'Asia/Jakarta', 'value':'Asia/Jakarta'},{'text':'Asia/Jayapura', 'value':'Asia/Jayapura'},{'text':'Asia/Jerusalem', 'value':'Asia/Jerusalem'},{'text':'Asia/Kabul', 'value':'Asia/Kabul'},{'text':'Asia/Kamchatka', 'value':'Asia/Kamchatka'},{'text':'Asia/Karachi', 'value':'Asia/Karachi'},{'text':'Asia/Kashgar', 'value':'Asia/Kashgar'},{'text':'Asia/Kathmandu', 'value':'Asia/Kathmandu'},{'text':'Asia/Katmandu', 'value':'Asia/Katmandu'},{'text':'Asia/Khandyga', 'value':'Asia/Khandyga'},{'text':'Asia/Kolkata', 'value':'Asia/Kolkata'},{'text':'Asia/Krasnoyarsk', 'value':'Asia/Krasnoyarsk'},{'text':'Asia/Kuala_Lumpur', 'value':'Asia/Kuala_Lumpur'},{'text':'Asia/Kuching', 'value':'Asia/Kuching'},{'text':'Asia/Kuwait', 'value':'Asia/Kuwait'},{'text':'Asia/Macao', 'value':'Asia/Macao'},{'text':'Asia/Macau', 'value':'Asia/Macau'},{'text':'Asia/Magadan', 'value':'Asia/Magadan'},{'text':'Asia/Makassar', 'value':'Asia/Makassar'},{'text':'Asia/Manila', 'value':'Asia/Manila'},{'text':'Asia/Muscat', 'value':'Asia/Muscat'},{'text':'Asia/Nicosia', 'value':'Asia/Nicosia'},{'text':'Asia/Novokuznetsk', 'value':'Asia/Novokuznetsk'},{'text':'Asia/Novosibirsk', 'value':'Asia/Novosibirsk'},{'text':'Asia/Omsk', 'value':'Asia/Omsk'},{'text':'Asia/Oral', 'value':'Asia/Oral'},{'text':'Asia/Phnom_Penh', 'value':'Asia/Phnom_Penh'},{'text':'Asia/Pontianak', 'value':'Asia/Pontianak'},{'text':'Asia/Pyongyang', 'value':'Asia/Pyongyang'},{'text':'Asia/Qatar', 'value':'Asia/Qatar'},{'text':'Asia/Qyzylorda', 'value':'Asia/Qyzylorda'},{'text':'Asia/Rangoon', 'value':'Asia/Rangoon'},{'text':'Asia/Riyadh', 'value':'Asia/Riyadh'},{'text':'Asia/Saigon', 'value':'Asia/Saigon'},{'text':'Asia/Sakhalin', 'value':'Asia/Sakhalin'},{'text':'Asia/Samarkand', 'value':'Asia/Samarkand'},{'text':'Asia/Seoul', 'value':'Asia/Seoul'},{'text':'Asia/Shanghai', 'value':'Asia/Shanghai'},{'text':'Asia/Singapore', 'value':'Asia/Singapore'},{'text':'Asia/Taipei', 'value':'Asia/Taipei'},{'text':'Asia/Tashkent', 'value':'Asia/Tashkent'},{'text':'Asia/Tbilisi', 'value':'Asia/Tbilisi'},{'text':'Asia/Tehran', 'value':'Asia/Tehran'},{'text':'Asia/Tel_Aviv', 'value':'Asia/Tel_Aviv'},{'text':'Asia/Thimbu', 'value':'Asia/Thimbu'},{'text':'Asia/Thimphu', 'value':'Asia/Thimphu'},{'text':'Asia/Tokyo', 'value':'Asia/Tokyo'},{'text':'Asia/Ujung_Pandang', 'value':'Asia/Ujung_Pandang'},{'text':'Asia/Ulaanbaatar', 'value':'Asia/Ulaanbaatar'},{'text':'Asia/Ulan_Bator', 'value':'Asia/Ulan_Bator'},{'text':'Asia/Urumqi', 'value':'Asia/Urumqi'},{'text':'Asia/Ust-Nera', 'value':'Asia/Ust-Nera'},{'text':'Asia/Vientiane', 'value':'Asia/Vientiane'},{'text':'Asia/Vladivostok', 'value':'Asia/Vladivostok'},{'text':'Asia/Yakutsk', 'value':'Asia/Yakutsk'},{'text':'Asia/Yekaterinburg', 'value':'Asia/Yekaterinburg'},{'text':'Asia/Yerevan', 'value':'Asia/Yerevan'},{'text':'Atlantic/Azores', 'value':'Atlantic/Azores'},{'text':'Atlantic/Bermuda', 'value':'Atlantic/Bermuda'},{'text':'Atlantic/Canary', 'value':'Atlantic/Canary'},{'text':'Atlantic/Cape_Verde', 'value':'Atlantic/Cape_Verde'},{'text':'Atlantic/Faeroe', 'value':'Atlantic/Faeroe'},{'text':'Atlantic/Faroe', 'value':'Atlantic/Faroe'},{'text':'Atlantic/Jan_Mayen', 'value':'Atlantic/Jan_Mayen'},{'text':'Atlantic/Madeira', 'value':'Atlantic/Madeira'},{'text':'Atlantic/Reykjavik', 'value':'Atlantic/Reykjavik'},{'text':'Atlantic/South_Georgia', 'value':'Atlantic/South_Georgia'},{'text':'Atlantic/St_Helena', 'value':'Atlantic/St_Helena'},{'text':'Atlantic/Stanley', 'value':'Atlantic/Stanley'},{'text':'Australia/ACT', 'value':'Australia/ACT'},{'text':'Australia/Adelaide', 'value':'Australia/Adelaide'},{'text':'Australia/Brisbane', 'value':'Australia/Brisbane'},{'text':'Australia/Broken_Hill', 'value':'Australia/Broken_Hill'},{'text':'Australia/Canberra', 'value':'Australia/Canberra'},{'text':'Australia/Currie', 'value':'Australia/Currie'},{'text':'Australia/Darwin', 'value':'Australia/Darwin'},{'text':'Australia/Eucla', 'value':'Australia/Eucla'},{'text':'Australia/Hobart', 'value':'Australia/Hobart'},{'text':'Australia/LHI', 'value':'Australia/LHI'},{'text':'Australia/Lindeman', 'value':'Australia/Lindeman'},{'text':'Australia/Lord_Howe', 'value':'Australia/Lord_Howe'},{'text':'Australia/Melbourne', 'value':'Australia/Melbourne'},{'text':'Australia/North', 'value':'Australia/North'},{'text':'Australia/NSW', 'value':'Australia/NSW'},{'text':'Australia/Perth', 'value':'Australia/Perth'},{'text':'Australia/Queensland', 'value':'Australia/Queensland'},{'text':'Australia/South', 'value':'Australia/South'},{'text':'Australia/Sydney', 'value':'Australia/Sydney'},{'text':'Australia/Tasmania', 'value':'Australia/Tasmania'},{'text':'Australia/Victoria', 'value':'Australia/Victoria'},{'text':'Australia/West', 'value':'Australia/West'},{'text':'Australia/Yancowinna', 'value':'Australia/Yancowinna'},{'text':'Brazil/Acre', 'value':'Brazil/Acre'},{'text':'Brazil/DeNoronha', 'value':'Brazil/DeNoronha'},{'text':'Brazil/East', 'value':'Brazil/East'},{'text':'Brazil/West', 'value':'Brazil/West'},{'text':'Canada/Atlantic', 'value':'Canada/Atlantic'},{'text':'Canada/Central', 'value':'Canada/Central'},{'text':'Canada/Eastern', 'value':'Canada/Eastern'},{'text':'Canada/East-Saskatchewan', 'value':'Canada/East-Saskatchewan'},{'text':'Canada/Mountain', 'value':'Canada/Mountain'},{'text':'Canada/Newfoundland', 'value':'Canada/Newfoundland'},{'text':'Canada/Pacific', 'value':'Canada/Pacific'},{'text':'Canada/Saskatchewan', 'value':'Canada/Saskatchewan'},{'text':'Canada/Yukon', 'value':'Canada/Yukon'},{'text':'Chile/Continental', 'value':'Chile/Continental'},{'text':'Chile/EasterIsland', 'value':'Chile/EasterIsland'},{'text':'Cuba', 'value':'Cuba'},{'text':'Egypt', 'value':'Egypt'},{'text':'Eire', 'value':'Eire'},{'text':'Etc/GMT', 'value':'Etc/GMT'},{'text':'Etc/GMT+0', 'value':'Etc/GMT+0'},{'text':'Etc/UCT', 'value':'Etc/UCT'},{'text':'Etc/Universal', 'value':'Etc/Universal'},{'text':'Etc/UTC', 'value':'Etc/UTC'},{'text':'Etc/Zulu', 'value':'Etc/Zulu'},{'text':'Europe/Amsterdam', 'value':'Europe/Amsterdam'},{'text':'Europe/Andorra', 'value':'Europe/Andorra'},{'text':'Europe/Athens', 'value':'Europe/Athens'},{'text':'Europe/Belfast', 'value':'Europe/Belfast'},{'text':'Europe/Belgrade', 'value':'Europe/Belgrade'},{'text':'Europe/Berlin', 'value':'Europe/Berlin'},{'text':'Europe/Bratislava', 'value':'Europe/Bratislava'},{'text':'Europe/Brussels', 'value':'Europe/Brussels'},{'text':'Europe/Bucharest', 'value':'Europe/Bucharest'},{'text':'Europe/Budapest', 'value':'Europe/Budapest'},{'text':'Europe/Busingen', 'value':'Europe/Busingen'},{'text':'Europe/Chisinau', 'value':'Europe/Chisinau'},{'text':'Europe/Copenhagen', 'value':'Europe/Copenhagen'},{'text':'Europe/Dublin', 'value':'Europe/Dublin'},{'text':'Europe/Gibraltar', 'value':'Europe/Gibraltar'},{'text':'Europe/Guernsey', 'value':'Europe/Guernsey'},{'text':'Europe/Helsinki', 'value':'Europe/Helsinki'},{'text':'Europe/Isle_of_Man', 'value':'Europe/Isle_of_Man'},{'text':'Europe/Istanbul', 'value':'Europe/Istanbul'},{'text':'Europe/Jersey', 'value':'Europe/Jersey'},{'text':'Europe/Kaliningrad', 'value':'Europe/Kaliningrad'},{'text':'Europe/Kiev', 'value':'Europe/Kiev'},{'text':'Europe/Lisbon', 'value':'Europe/Lisbon'},{'text':'Europe/Ljubljana', 'value':'Europe/Ljubljana'},{'text':'Europe/London', 'value':'Europe/London'},{'text':'Europe/Luxembourg', 'value':'Europe/Luxembourg'},{'text':'Europe/Madrid', 'value':'Europe/Madrid'},{'text':'Europe/Malta', 'value':'Europe/Malta'},{'text':'Europe/Mariehamn', 'value':'Europe/Mariehamn'},{'text':'Europe/Minsk', 'value':'Europe/Minsk'},{'text':'Europe/Monaco', 'value':'Europe/Monaco'},{'text':'Europe/Moscow', 'value':'Europe/Moscow'},{'text':'Europe/Nicosia', 'value':'Europe/Nicosia'},{'text':'Europe/Oslo', 'value':'Europe/Oslo'},{'text':'Europe/Paris', 'value':'Europe/Paris'},{'text':'Europe/Podgorica', 'value':'Europe/Podgorica'},{'text':'Europe/Prague', 'value':'Europe/Prague'},{'text':'Europe/Riga', 'value':'Europe/Riga'},{'text':'Europe/Rome', 'value':'Europe/Rome'},{'text':'Europe/Samara', 'value':'Europe/Samara'},{'text':'Europe/San_Marino', 'value':'Europe/San_Marino'},{'text':'Europe/Sarajevo', 'value':'Europe/Sarajevo'},{'text':'Europe/Simferopol', 'value':'Europe/Simferopol'},{'text':'Europe/Skopje', 'value':'Europe/Skopje'},{'text':'Europe/Sofia', 'value':'Europe/Sofia'},{'text':'Europe/Stockholm', 'value':'Europe/Stockholm'},{'text':'Europe/Tallinn', 'value':'Europe/Tallinn'},{'text':'Europe/Tirane', 'value':'Europe/Tirane'},{'text':'Europe/Tiraspol', 'value':'Europe/Tiraspol'},{'text':'Europe/Uzhgorod', 'value':'Europe/Uzhgorod'},{'text':'Europe/Vaduz', 'value':'Europe/Vaduz'},{'text':'Europe/Vatican', 'value':'Europe/Vatican'},{'text':'Europe/Vienna', 'value':'Europe/Vienna'},{'text':'Europe/Vilnius', 'value':'Europe/Vilnius'},{'text':'Europe/Volgograd', 'value':'Europe/Volgograd'},{'text':'Europe/Warsaw', 'value':'Europe/Warsaw'},{'text':'Europe/Zagreb', 'value':'Europe/Zagreb'},{'text':'Europe/Zaporozhye', 'value':'Europe/Zaporozhye'},{'text':'Europe/Zurich', 'value':'Europe/Zurich'},{'text':'GB', 'value':'GB'},{'text':'GB-Eire', 'value':'GB-Eire'},{'text':'GMT', 'value':'GMT'},{'text':'GMT+0', 'value':'GMT+0'},{'text':'GMT0', 'value':'GMT0'},{'text':'GMT-0', 'value':'GMT-0'},{'text':'Greenwich', 'value':'Greenwich'},{'text':'Hongkong', 'value':'Hongkong'},{'text':'Iceland', 'value':'Iceland'},{'text':'Indian/Antananarivo', 'value':'Indian/Antananarivo'},{'text':'Indian/Chagos', 'value':'Indian/Chagos'},{'text':'Indian/Christmas', 'value':'Indian/Christmas'},{'text':'Indian/Cocos', 'value':'Indian/Cocos'},{'text':'Indian/Comoro', 'value':'Indian/Comoro'},{'text':'Indian/Kerguelen', 'value':'Indian/Kerguelen'},{'text':'Indian/Mahe', 'value':'Indian/Mahe'},{'text':'Indian/Maldives', 'value':'Indian/Maldives'},{'text':'Indian/Mauritius', 'value':'Indian/Mauritius'},{'text':'Indian/Mayotte', 'value':'Indian/Mayotte'},{'text':'Indian/Reunion', 'value':'Indian/Reunion'},{'text':'Iran', 'value':'Iran'},{'text':'Israel', 'value':'Israel'},{'text':'Jamaica', 'value':'Jamaica'},{'text':'Japan', 'value':'Japan'},{'text':'Kwajalein', 'value':'Kwajalein'},{'text':'Libya', 'value':'Libya'},{'text':'Mexico/BajaNorte', 'value':'Mexico/BajaNorte'},{'text':'Mexico/BajaSur', 'value':'Mexico/BajaSur'},{'text':'Mexico/General', 'value':'Mexico/General'},{'text':'Navajo', 'value':'Navajo'},{'text':'NZ', 'value':'NZ'},{'text':'NZ-CHAT', 'value':'NZ-CHAT'},{'text':'Pacific/Apia', 'value':'Pacific/Apia'},{'text':'Pacific/Auckland', 'value':'Pacific/Auckland'},{'text':'Pacific/Chatham', 'value':'Pacific/Chatham'},{'text':'Pacific/Chuuk', 'value':'Pacific/Chuuk'},{'text':'Pacific/Easter', 'value':'Pacific/Easter'},{'text':'Pacific/Efate', 'value':'Pacific/Efate'},{'text':'Pacific/Enderbury', 'value':'Pacific/Enderbury'},{'text':'Pacific/Fakaofo', 'value':'Pacific/Fakaofo'},{'text':'Pacific/Fiji', 'value':'Pacific/Fiji'},{'text':'Pacific/Funafuti', 'value':'Pacific/Funafuti'},{'text':'Pacific/Galapagos', 'value':'Pacific/Galapagos'},{'text':'Pacific/Gambier', 'value':'Pacific/Gambier'},{'text':'Pacific/Guadalcanal', 'value':'Pacific/Guadalcanal'},{'text':'Pacific/Guam', 'value':'Pacific/Guam'},{'text':'Pacific/Honolulu', 'value':'Pacific/Honolulu'},{'text':'Pacific/Johnston', 'value':'Pacific/Johnston'},{'text':'Pacific/Kiritimati', 'value':'Pacific/Kiritimati'},{'text':'Pacific/Kosrae', 'value':'Pacific/Kosrae'},{'text':'Pacific/Kwajalein', 'value':'Pacific/Kwajalein'},{'text':'Pacific/Majuro', 'value':'Pacific/Majuro'},{'text':'Pacific/Marquesas', 'value':'Pacific/Marquesas'},{'text':'Pacific/Midway', 'value':'Pacific/Midway'},{'text':'Pacific/Nauru', 'value':'Pacific/Nauru'},{'text':'Pacific/Niue', 'value':'Pacific/Niue'},{'text':'Pacific/Norfolk', 'value':'Pacific/Norfolk'},{'text':'Pacific/Noumea', 'value':'Pacific/Noumea'},{'text':'Pacific/Pago_Pago', 'value':'Pacific/Pago_Pago'},{'text':'Pacific/Palau', 'value':'Pacific/Palau'},{'text':'Pacific/Pitcairn', 'value':'Pacific/Pitcairn'},{'text':'Pacific/Pohnpei', 'value':'Pacific/Pohnpei'},{'text':'Pacific/Ponape', 'value':'Pacific/Ponape'},{'text':'Pacific/Port_Moresby', 'value':'Pacific/Port_Moresby'},{'text':'Pacific/Rarotonga', 'value':'Pacific/Rarotonga'},{'text':'Pacific/Saipan', 'value':'Pacific/Saipan'},{'text':'Pacific/Samoa', 'value':'Pacific/Samoa'},{'text':'Pacific/Tahiti', 'value':'Pacific/Tahiti'},{'text':'Pacific/Tarawa', 'value':'Pacific/Tarawa'},{'text':'Pacific/Tongatapu', 'value':'Pacific/Tongatapu'},{'text':'Pacific/Truk', 'value':'Pacific/Truk'},{'text':'Pacific/Wake', 'value':'Pacific/Wake'},{'text':'Pacific/Wallis', 'value':'Pacific/Wallis'},{'text':'Pacific/Yap', 'value':'Pacific/Yap'},{'text':'Poland', 'value':'Poland'},{'text':'Portugal', 'value':'Portugal'},{'text':'PRC', 'value':'PRC'},{'text':'ROC', 'value':'ROC'},{'text':'ROK', 'value':'ROK'},{'text':'Singapore', 'value':'Singapore'},{'text':'Turkey', 'value':'Turkey'},{'text':'UCT', 'value':'UCT'},{'text':'Universal', 'value':'Universal'},{'text':'US/Alaska', 'value':'US/Alaska'},{'text':'US/Aleutian', 'value':'US/Aleutian'},{'text':'US/Arizona', 'value':'US/Arizona'},{'text':'US/Central', 'value':'US/Central'},{'text':'US/Eastern', 'value':'US/Eastern'},{'text':'US/East-Indiana', 'value':'US/East-Indiana'},{'text':'US/Hawaii', 'value':'US/Hawaii'},{'text':'US/Indiana-Starke', 'value':'US/Indiana-Starke'},{'text':'US/Michigan', 'value':'US/Michigan'},{'text':'US/Mountain', 'value':'US/Mountain'},{'text':'US/Pacific', 'value':'US/Pacific'},{'text':'US/Samoa', 'value':'US/Samoa'},{'text':'UTC', 'value':'UTC'},{'text':'W-SU', 'value':'W-SU'},{'text':'Zulu', 'value':'Zulu'},
]

class AddScheduleTime extends Component {
    constructor(props) {
        super(props);

        if (this.props.id) {
          var repeat_days = ['repeat_sunday','repeat_monday','repeat_tuesday','repeat_wednesday','repeat_thursday','repeat_friday','repeat_saturday']
          var newState = JSON.parse(JSON.stringify(this.props));
          newState['show_calendar'] = false;
          newState['choice'] = 'start_time'

          var recurring = false;
          for (var index in repeat_days) {
            if (this.props[repeat_days[index]] == true) {
              recurring = true;
            }
          }
          newState['recurring'] = recurring
          newState['timezone'] = this.props.timezone;

          this.state = newState;
        }
        else {
          this.state = {'timezone': DateTime.local().zoneName, 'required': this.props.required, 'show_calendar':false, 'recurring':false, 'choice':'start_time', 'start_time' : 'Click To Choose', 'end_time' : 'Click To Choose', 'available' : false, 'repeat_monday' : false, 'repeat_tuesday' : false, 'repeat_wednesday' : false, 'repeat_thursday' : false, 'repeat_friday' : false, 'repeat_saturday' : false, 'repeat_sunday' : false, 'user' : this.props.user_id, 'event' : this.props.event_id};
        }

        this.objectCallback = this.objectCallback.bind(this);
        this.chooseStartTime = this.chooseStartTime.bind(this);
        this.chooseEndTime = this.chooseEndTime.bind(this);
        this.chooseRecurringTime = this.chooseRecurringTime.bind(this);
        this.chooseOneTime = this.chooseOneTime.bind(this);
        this.repeat_monday = this.repeat_monday.bind(this);
        this.repeat_tuesday = this.repeat_tuesday.bind(this);
        this.repeat_wednesday = this.repeat_wednesday.bind(this);
        this.repeat_thursday = this.repeat_thursday.bind(this);
        this.repeat_friday = this.repeat_friday.bind(this);
        this.repeat_saturday = this.repeat_saturday.bind(this);
        this.repeat_sunday = this.repeat_sunday.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.chooseAvailability = this.chooseAvailability.bind(this);
        this.changeAvailabilityState = this.changeAvailabilityState.bind(this);
    }

    componentDidMount(value) {
        if(this.props.scheduletime_id) {
          ajaxWrapper('GET','/api/home/scheduletime/' + this.props.scheduletime_id + '/', {}, this.objectCallback);
        }
        else {
          this.setState({loaded:true})
        }
    }

    objectCallback(result) {
      var scheduletime = result[0]['scheduletime'];
      console.log("Schedule Time Callback", scheduletime)
      scheduletime['loaded'] = true;
      this.setState(scheduletime)
    }

    chooseStartTime() {
      this.setState({'choosing':'start_time', 'show_calendar':true});
    }

    chooseEndTime() {
      this.setState({'choosing':'end_time', 'show_calendar':true});
    }

    chooseAvailability(value) {
      var newState = {}
      newState[this.state.choosing] = value;
      newState['show_calendar'] = false;
      this.setState(newState);
    }

    chooseRecurringTime() {
      this.setState({'recurring':true})
    }

    chooseOneTime() {
      this.setState({'recurring':false})
    }

    changeAvailabilityState(newState) {
      this.setState(newState)
    }

    save() {
      var data = this.state;
      if (this.props.id) {
        ajaxWrapper('POST', '/api/home/scheduletime/' + this.props.id + '/',data, this.props.refreshData)
      }
      else {
        ajaxWrapper('POST', '/api/home/scheduletime/',data, this.props.refreshData)
      }
    }

    delete() {
      ajaxWrapper('POST', '/api/home/scheduletime/' + this.props.id + '/delete/',{}, this.props.refreshData)
    }


    repeat_monday() {
      this.setState({'repeat_monday':!this.state.repeat_monday})
    }
    repeat_tuesday() {
      this.setState({'repeat_tuesday':!this.state.repeat_tuesday})
    }
    repeat_wednesday() {
      this.setState({'repeat_wednesday':!this.state.repeat_wednesday})
    }
    repeat_thursday() {
      this.setState({'repeat_thursday':!this.state.repeat_thursday})
    }
    repeat_friday() {
      this.setState({'repeat_friday':!this.state.repeat_friday})
    }
    repeat_saturday() {
      this.setState({'repeat_saturday':!this.state.repeat_saturday})
    }
    repeat_sunday() {
      this.setState({'repeat_sunday':!this.state.repeat_sunday})
    }

    render() {


			var available = {'name': 'available', 'defaultoption':false, 'setFormState': this.changeAvailabilityState,'value': this.state.available, 'layout':'form-inline', 'options': [{'value':true,'text':'available'},{'value':false,'text':'un-available'}]};

      var recurringType = 'outline-primary';
      var oneTimeType = 'primary';
      var start_time_text = this.state.start_time;
      var end_time_text = this.state.end_time;
      if (this.state.recurring) {
        recurringType = 'primary';
        oneTimeType = 'outline-primary'

        if (start_time_text != 'Click To Choose') {
          if (this.state.start_time.split(" ")[1]) {
            start_time_text = this.state.start_time.split(" ")[1]
          }
          else {
            start_time_text = this.state.start_time.split("T")[1]
          }

        }
        if (end_time_text != 'Click To Choose') {
          if (this.state.end_time.split(" ")[1]) {
            end_time_text = this.state.end_time.split(" ")[1]
          }
          else {
            end_time_text = this.state.end_time.split("T")[1]
          }
        }
      }

			var repeat_monday = {'name': 'repeat_monday', 'label': 'Monday', 'value': 'repeat_monday', 'checked': this.state.repeat_monday, 'onChange':this.repeat_monday, 'style':{'display':'inline-block','paddingRight':'10px'}};
			var repeat_tuesday = {'name': 'repeat_tuesday', 'label': 'Tuesday', 'value': 'repeat_tuesday', 'checked': this.state.repeat_tuesday, 'onChange':this.repeat_tuesday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_wednesday = {'name': 'repeat_wednesday', 'label': 'Wednesday', 'value': 'repeat_wednesday', 'checked': this.state.repeat_wednesday, 'onChange':this.repeat_wednesday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_thursday = {'name': 'repeat_thursday', 'label': 'Thursday', 'value': 'repeat_thursday', 'checked': this.state.repeat_thursday, 'onChange':this.repeat_thursday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_friday = {'name': 'repeat_friday', 'label': 'Friday', 'value': 'repeat_friday', 'checked': this.state.repeat_friday, 'onChange':this.repeat_friday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_saturday = {'name': 'repeat_saturday', 'label': 'Saturday', 'value': 'repeat_saturday', 'checked': this.state.repeat_saturday, 'onChange':this.repeat_saturday, 'style':{'display':'inline-block','paddingRight':'10px'}};
      var repeat_sunday = {'name': 'repeat_sunday', 'label': 'Sunday', 'value': 'repeat_sunday', 'checked': this.state.repeat_sunday, 'onChange':this.repeat_sunday, 'style':{'display':'inline-block','paddingRight':'10px'}};

        var defaults = this.state;

        var submitUrl = "/api/home/scheduletime/";
        if (this.props.scheduletime_id) {
          submitUrl += this.props.scheduletime_id + '/';
        }

        var recurringCheck = [];
        if (this.state.recurring) {
          recurringCheck.push(<p style={{'margin':'0px'}}>Every</p>)
          recurringCheck.push(<Checkbox {...repeat_monday} />)
          recurringCheck.push(<Checkbox {...repeat_tuesday} />)
          recurringCheck.push(<Checkbox {...repeat_wednesday} />)
          recurringCheck.push(<Checkbox {...repeat_thursday} />)
          recurringCheck.push(<Checkbox {...repeat_friday} />)
          recurringCheck.push(<Checkbox {...repeat_saturday} />)
          recurringCheck.push(<Checkbox {...repeat_sunday} />)
          recurringCheck.push(<br />)
        }

        var buttons = [];
        buttons.push(<Button type={'outline-success'} text={'Save'} clickHandler={this.save} />)
        if (this.props.id) {
          buttons.push(<Button type={'outline-danger'} text={'Delete'} deleteType={true} clickHandler={this.delete} />)
        }

        var calendar = null;
        if (this.state.show_calendar) {
          calendar = <TimeSelect timezone={this.state.timezone} recurring={this.state.recurring} chooseAvailability={this.chooseAvailability} scheduleTimes={this.props.scheduleTimes} />
        }

        return (
          <div>
            <Select setFormState={this.changeAvailabilityState} options={timezones} name={'timezone'} value={this.state.timezone} label={'Time Zone'} />
            <Button text={'Recurring'} type={recurringType} clickHandler={this.chooseRecurringTime} />
            <Button text={'One-Time'} type={oneTimeType} clickHandler={this.chooseOneTime} />
            <p>I'm <div style={{'display':'inline-block'}}><Select {...available} /></div> between <Button text={start_time_text} type={'outline-primary'} clickHandler={this.chooseStartTime} /> and <Button text={end_time_text} type={'outline-primary'} clickHandler={this.chooseEndTime} /></p>
            {recurringCheck}
            {buttons}
            <br />
            {calendar}
          </div>
             );
    }
}
export default AddScheduleTime;
