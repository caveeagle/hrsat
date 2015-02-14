#!/usr/bin/perl -w

use strict;
use SDB::cgi;
use SDB::common;
use Data::Dumper;
use _host qw ($CURRENT_SERVER);

use Projects::common::general_names_config qw (%SATS_NAMES %DEVICES_NAMES %CENTERS_NAMES);


#########################################
#########################################

my $RET;

#########################################

$RET = $RET."var SATELLITES_NAMES_TRANSLATION ={\n";

foreach my $k (keys %SATS_NAMES)
{ 
 $RET = $RET." \"$k\" : {\n";
 $RET = $RET." \"name\" : \"".$SATS_NAMES{$k}{'name'}."\", \n";
 $RET = $RET." \"engname\" : \"".$SATS_NAMES{$k}{'engname'}."\" \n";
 $RET = $RET."},\n";
}
chop($RET);
chop($RET);
$RET = $RET."}; \n\n";

#########################################

$RET = $RET."var DEVICES_NAMES_TRANSLATION ={\n";

foreach my $k (keys %DEVICES_NAMES)
{ 
 $RET = $RET." \"$k\" : {\n";
 $RET = $RET." \"name\" : \"".$DEVICES_NAMES{$k}{'name'}."\", \n";
 $RET = $RET." \"engname\" : \"".$DEVICES_NAMES{$k}{'engname'}."\" \n";
 $RET = $RET."},\n";
}
chop($RET);
chop($RET);
$RET = $RET."}; \n\n";

#########################################


$RET = $RET."var CENTERS_NAMES_TRANSLATION ={\n";

foreach my $k (keys %CENTERS_NAMES)
{ 
 $RET = $RET." \"$k\" : {\n";
 $RET = $RET." \"name\" : \"".$CENTERS_NAMES{$k}{'name'}."\", \n";
 $RET = $RET." \"engname\" : \"".$CENTERS_NAMES{$k}{'engname'}."\" \n";
 $RET = $RET."},\n";
}
chop($RET);
chop($RET);
$RET = $RET."}; \n\n";



#########################################
#########################################

print_content_type;

print $RET;

exit(0);

