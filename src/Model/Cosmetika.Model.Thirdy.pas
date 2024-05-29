unit Cosmetika.Model.Thirdy;

interface

uses
  System.JSON;

type
  TThirdy = class
  private
    FRowId: Integer;
    FName: string;
    FNameAlias: string;
    FDocument: string;
    FIsSupplier: Boolean;
    procedure SetDocument(const Value: string);
  published
    property RowId: Integer read FRowId write FRowId;
    property Name: string read FName write FName;
    property NameAlias: string read FNameAlias write FNameAlias;
    property Document: string read FDocument write SetDocument;
    property IsSupplier: Boolean read FIsSupplier write FIsSupplier;
  public
    class function FromJSON(JSON: TJSONObject): TThirdy;
    function ToJSON: TJSONObject;
  end;

implementation

uses
  Cosmetika.Utils;

{ TThirdy }

class function TThirdy.FromJSON(JSON: TJSONObject): TThirdy;
begin
  Result := TThirdy.Create;

  Result.Name := JSON.GetValue<string>('name', '');
  Result.NameAlias := JSON.GetValue<string>('nameAlias', '');
  Result.Document := JSON.GetValue<string>('document', '');
  Result.IsSupplier := JSON.GetValue<Boolean>('is_supplier', False);
end;

procedure TThirdy.SetDocument(const Value: string);
begin
  FDocument := FormatDocument(Value);
end;

function TThirdy.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('rowid', TJSONNumber.Create(FRowId));
  Result.AddPair('name', TJSONString.Create(FName));
  Result.AddPair('nameAlias', TJSONString.Create(FNameAlias));
  Result.AddPair('document', TJSONString.Create(FDocument));
end;

end.
