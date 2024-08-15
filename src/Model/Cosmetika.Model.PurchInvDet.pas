unit Cosmetika.Model.PurchInvDet;

interface

uses
  Cosmetika.Model.Product, System.JSON, System.Generics.Collections;

type
  TPurchInvDet = class
  private
    FProduct: TProduct;
    FPurchInvId: Integer;
    FUnitary: Double;
    FQuantity: Double;
    FTotal: Double;
    FRowId: Integer;
  public
    class function FromJSON(JSON: TJSONObject): TPurchInvDet;
    function ToJSON: TJSONObject;
  published
    property RowId: Integer read FRowId write FRowId;
    property Product: TProduct read FProduct write FProduct;
    property PurchInvId: Integer read FPurchInvId write FPurchInvId;
    property Unitary: Double read FUnitary write FUnitary;
    property Quantity: Double read FQuantity write FQuantity;
    property Total: Double read FTotal write FTotal;
  end;

  TPurchInvDetCollection = class(TList<TPurchInvDet>)
  public
    constructor Create;
    destructor Destroy; override;
    function ToJSON: TJSONArray;
  published
  end;

implementation

uses
  Cosmetika.Dao.Product;


{ TPurchInvDet }

class function TPurchInvDet.FromJSON(JSON: TJSONObject): TPurchInvDet;
var
  ProductDao: TDmProduct;
begin
  Result := TPurchInvDet.Create;
  ProductDao := TDmProduct.Create;

  try
    Result.RowId := JSON.GetValue<Integer>('rowid', 0);
    Result.Product := ProductDao.GetBy('rowid', JSON.GetValue<Integer>('fkProductId', 0));
    Result.Unitary := JSON.GetValue<Double>('unitary', 0);
    Result.Quantity := JSON.GetValue<Double>('quantity', 0);
    Result.Total := JSON.GetValue<Double>('total', 0);
  finally
    ProductDao.Free;
  end;
end;

function TPurchInvDet.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('rowid', TJSONNumber.Create(FRowId));
  Result.AddPair('fkPurchInvId', TJSONNumber.Create(FPurchInvId));
  Result.AddPair('product', FProduct.ToJSON);
  Result.AddPair('unitary', TJSONNumber.Create(FUnitary));
  Result.AddPair('quantity', TJSONNumber.Create(Quantity));
  Result.AddPair('total', TJSONNumber.Create(Total));
end;

{ TPurchInvDetCollection }

constructor TPurchInvDetCollection.Create;
begin
  inherited Create;
end;

destructor TPurchInvDetCollection.Destroy;
begin
  inherited Destroy;
end;

function TPurchInvDetCollection.ToJSON: TJSONArray;
var
  I: Integer;
begin
  Result :=  TJSONArray.Create;

  for I := 0 to Pred(Count) do
    Result.Add(Items[I].ToJSON);
end;

end.
