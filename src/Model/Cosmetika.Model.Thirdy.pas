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
    function GetDocument: string; 
  published
    property RowId: Integer read FRowId write FRowId;
    property Name: string read FName write FName;
    property NameAlias: string read FNameAlias write FNameAlias;
    property Document: string read GetDocument write FDocument;
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

function TThirdy.GetDocument: string;
begin
  Result := FormatDocument(FDocument);
end; 

function TThirdy.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('rowid', TJSONNumber.Create(RowId));
  Result.AddPair('name', TJSONString.Create(Name));
  Result.AddPair('nameAlias', TJSONString.Create(NameAlias));
  Result.AddPair('document', TJSONString.Create(Document));
end;

end.
