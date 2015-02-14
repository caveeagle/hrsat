#!/usr/bin/perl -w

use strict;
use SDB::cgi;
use SDB::common;
use Data::Dumper;
use _host qw ($CURRENT_SERVER);

use Projects::common::sources4interfaces qw (%SOURCES_BY_PROJECTS @SOURCES_4_INTERFACE);

#########################################
#########################################

my $PROJECT = $ENV{'PROJECT'};

if( ($CURRENT_SERVER eq "smisdev") && ($PROJECT eq "aviales") )
{
    $PROJECT = "dev"; # ALL SOURCES
}    

unless($SOURCES_BY_PROJECTS{$PROJECT})
{
    $PROJECT = "open";
}    

my @ALLOWED_SOURCES_LIST = @{$SOURCES_BY_PROJECTS{$PROJECT}};

my @RESULT_LIST;

foreach my $el (@SOURCES_4_INTERFACE)
{
    my $id = $el->{'id'};
    
    # check for allowed
    unless(find_in_array($id,\@ALLOWED_SOURCES_LIST)) {next;}
    
    push(@RESULT_LIST,$el);
}    

#########################################
#########################################

my $RESULT_STR = Dumper(\@RESULT_LIST);

my $str1 = "{ id: 'Stn', name:'AllStations',type:'root',stype:'group'},";
$RESULT_STR =~s /\$VAR1 = \[/ /;
$RESULT_STR = '['."\n".$str1.$RESULT_STR;
$RESULT_STR =~s /=>/:/g;

$RESULT_STR =~s /\"/\#/g;



$RESULT_STR =~s /\'/\"/g;
$RESULT_STR =~s /\"checked\" : \"true\"/checked : true/g;

$RESULT_STR =~s /\#/\\\"/g;



#########################################
#########################################

print_content_type;

print $RESULT_STR;

exit(0);


#########################################
#########################################
#########################################
#########################################

sub find_in_array
{
  my $elem = shift;
  my $mah = shift;
  my @my_array = @{$mah};

  foreach my $l2 (@my_array)
  {
    if($elem eq $l2)
    {
        return 1;
    }    
  }  
  return 0;  
}

