unit Cosmetika.Utils;

interface

uses System.RegularExpressions, System.SysUtils;

function NumbersOnly(const Text: string): string;
function FormatDocument(const Text: string): string;

implementation

function NumbersOnly(const Text: string): string;
begin
  Result := TRegEx.Replace(Text, '[^\d]+', '');
end;

function FormatDocument(const Text: string): string;
begin
  case Length(Text) of
    11:
      begin
        Result := Text.Substring(0, 3)
                  + '.' + Text.Substring(3, 3)
                  + '.' + Text.Substring(6, 3)
                  + '-' + Text.Substring(9, 2);
      end;
    14:
      begin
        Result := Text.Substring(0, 2)
                  + '.' + Text.Substring(2, 3)
                  + '.' + Text.Substring(5, 3)
                  + '/' + Text.Substring(8, 4)
                  + '-' + Text.Substring(12, 2);
      end;
  else
    Result := Text;
  end;
end;

end.
