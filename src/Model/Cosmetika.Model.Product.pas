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
    class function FromJSON(Product: TJSONObject): TProduct;
    function ToJSON: TJSONObject;
  published
    property RowId: Integer read FRowId write FRowId;
    property Reference: string read FReference write FReference;
    property Name: string read FName write FName;
    property NameAlias: string read FNameAlias write FNameAlias;
    property Status: Boolean read FStatus write FStatus default True;
    property ToSell: Boolean read FToSell write FToSell default True;
    property ToBuy: Boolean read FToBuy write FToBuy default True;
  end;

implementation

{ TProduct }

class function TProduct.FromJSON(Product: TJSONObject): TProduct;
begin
  Result := TProduct.Create;

  if Assigned(Product.FindValue('reference')) then Result.Reference := Product.GetValue<string>('reference');
  if Assigned(Product.FindValue('name'))      then Result.Name      := Product.GetValue<string>('name');
  if Assigned(Product.FindValue('nameAlias')) then Result.NameAlias := Product.GetValue<string>('nameAlias');
  if Assigned(Product.FindValue('status'))    then Result.Status    := Product.GetValue<Boolean>('status');
  if Assigned(Product.FindValue('toSell'))    then Result.ToSell    := Product.GetValue<Boolean>('toSell');
  if Assigned(Product.FindValue('toBuy'))     then Result.ToBuy     := Product.GetValue<Boolean>('toBuy');
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

