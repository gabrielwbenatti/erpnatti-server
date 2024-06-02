unit Cosmetika.Model.Product;

interface

uses
  System.JSON;

type
  TProduct = class
  private
    FRowId: Integer;
    FReference: string;
    FName: string;
    FNameAlias: string;
    FStatus: Boolean;
    FToSell: Boolean;
    FToBuy: Boolean;
  public
    class function FromJSON(JSON: TJSONObject): TProduct;
    function ToJSON: TJSONObject;
  published
    property RowId: Integer read FRowId write FRowId;
    property Reference: string read FReference write FReference;
    property Name: string read FName write FName;
    property NameAlias: string read FNameAlias write FNameAlias;
    property Status: Boolean read FStatus write FStatus;
    property ToSell: Boolean read FToSell write FToSell;
    property ToBuy: Boolean read FToBuy write FToBuy;
  end;

implementation

{ TProduct }

class function TProduct.FromJSON(JSON: TJSONObject): TProduct;
begin
  Result := TProduct.Create;

  Result.Reference := JSON.GetValue<string>('reference', '');
  Result.Name := JSON.GetValue<string>('name', '');
  Result.NameAlias := JSON.GetValue<string>('nameAlias', '');
  Result.Status := JSON.GetValue<Boolean>('status', True);
  Result.ToSell := JSON.GetValue<Boolean>('toSell', True);
  Result.ToBuy := JSON.GetValue<Boolean>('toBuy', True);
end;

function TProduct.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('rowid', TJSONNumber.Create(FRowId));
  Result.AddPair('reference', TJSONString.Create(FReference));
  Result.AddPair('name', TJSONString.Create(FName));
  Result.AddPair('nameAlias', TJSONString.Create(FNameAlias));
  Result.AddPair('status', TJSONBool.Create(FStatus));
  Result.AddPair('toSell', TJSONBool.Create(FToSell));
  Result.AddPair('toBuy', TJSONBool.Create(FToBuy));
end;

end.
