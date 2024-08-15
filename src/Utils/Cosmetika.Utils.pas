unit Cosmetika.Utils;

interface

uses System.RegularExpressions, System.SysUtils;

function NumbersOnly(const Text: string): string;
function FormatDocument(const Text: string): string;
function DateToJSON(const Date: TDate): string;
function JSONToDate(const Date: string): TDate;

implementation

function NumbersOnly(const Text: string): string;
begin
  Result := TRegEx.Replace(Text, '[^\d]+', '');
end;

function FormatDocument(const Text: string): string;
var
  LText: string;
begin
  LText := Trim(NumbersOnly(Text));

  case Length(LText) of
    11:
      begin
        Result := LText.Substring(0, 3) + '.' + LText.Substring(3, 3) + '.' +
          LText.Substring(6, 3) + '-' + LText.Substring(9, 2);
      end;
    14:
      begin
        Result := LText.Substring(0, 2) + '.' + LText.Substring(2, 3) + '.' +
          LText.Substring(5, 3) + '/' + LText.Substring(8, 4) + '-' +
          LText.Substring(12, 2);
      end;
  else
    Result := LText;
  end;
end;

function DateToJSON(const Date: TDate): string;
begin
  if Date = 0 then
    Result := ''
  else
    Result := FormatDateTime('yyyy-MM-dd', Date);
end;

function JSONToDate(const Date: string): TDate;
var
  DateArray: TArray<string>;
begin
  if Date.Trim = '' then
    Result := 0
  else
  begin
    DateArray := Date.Split(['-']);
    Result := StrToDate(DateArray[2] + '/' + DateArray[1] + '/' + DateArray[0]);
  end;
end;

end.
