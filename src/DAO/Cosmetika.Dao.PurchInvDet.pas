unit Cosmetika.Dao.PurchInvDet;

interface

uses
  System.SysUtils, System.Classes, Cosmetika.Dao.Generic, FireDAC.Stan.Intf,
  FireDAC.Stan.Option, FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf,
  FireDAC.Stan.Def, FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, FireDAC.ConsoleUI.Wait,
  FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf, FireDAC.DApt, Data.DB,
  FireDAC.Comp.DataSet, FireDAC.Comp.Client, Cosmetika.Model.PurchInvDet,
  System.Generics.Collections, FireDAC.VCLUI.Wait;

type
  TDmPurchInvDet = class(TDmGeneric)
  private
    { Private declarations }
  public
    { Public declarations }
    function GetByPurchId(PurchInvId: Integer): TPurchInvDetCollection;
    function Store(Det: TList<TPurchInvDet>; PurchInvId: Integer): Boolean;
  end;

var
  DmPurchInvDet: TDmPurchInvDet;

implementation

uses
  Cosmetika.Dao.Product;

{%CLASSGROUP 'System.Classes.TPersistent'}

{$R *.dfm}

{ TDmPurchInvDet }

function TDmPurchInvDet.GetByPurchId(PurchInvId: Integer): TPurchInvDetCollection;
var
  PurchInvItem: TPurchInvDet;
  ProductDao: TDmProduct;
begin
  Result := TPurchInvDetCollection.Create;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from PURCH_INV_DET ');
    SQL.Add(' where FK_PURCH_INV_ID = :FK_PURCH_INV_ID');
    ParamByName('FK_PURCH_INV_ID').AsInteger := PurchInvId;
    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    FDQuery.FetchAll;
    FDQuery.First;
    try
      ProductDao := TDmProduct.Create;
      while not FDQuery.Eof do
      begin
        PurchInvItem := TPurchInvDet.Create;

        PurchInvItem.RowId := FDQuery.FieldByName('ROWID').AsInteger;
        PurchInvItem.PurchInvId := FDQuery.FieldByName('FK_PURCH_INV_ID').AsInteger;
        PurchInvItem.Unitary := FDQuery.FieldByName('UNITARY').AsFloat;
        PurchInvItem.Quantity := FDQuery.FieldByName('QUANTITY').AsFloat;
        PurchInvItem.Total := FDQuery.FieldByName('TOTAL').AsFloat;

        PurchInvItem.Product := ProductDao.GetById
          (FDQuery.FieldByName('FK_PRODUCT_ID').AsInteger);

        Result.Add(PurchInvItem);

        FDQuery.Next;
      end;
    finally
      ProductDao.Free;
    end;
  end;
end;

function TDmPurchInvDet.Store(Det: TList<TPurchInvDet>;
  PurchInvId: Integer): Boolean;
var
  I: Integer;
begin
  if Det.Count = 0 then Exit;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add('insert into ');
    SQL.Add('    PURCH_INV_DET ( ');
    SQL.Add('        FK_PURCH_INV_ID, ');
    SQL.Add('        FK_PRODUCT_ID, ');
    SQL.Add('        UNITARY, ');
    SQL.Add('        QUANTITY, ');
    SQL.Add('        TOTAL ');
    SQL.Add('    ) ');
    SQL.Add('values ');
    SQL.Add('    ( ');
    SQL.Add('        :FK_PURCH_INV_ID, ');
    SQL.Add('        :FK_PRODUCT_ID, ');
    SQL.Add('        :UNITARY, ');
    SQL.Add('        :QUANTITY, ');
    SQL.Add('        :TOTAL ');
    SQL.Add('    ) ');
  end;

  for I := 0 to Pred(Det.Count) do
  begin
    with FDQuery do
    begin
      ParamByName('FK_PURCH_INV_ID').AsInteger := PurchInvId;
      ParamByName('FK_PRODUCT_ID').AsInteger := Det[I].Product.RowId;
      ParamByName('UNITARY').AsFloat := Det[I].Unitary;
      ParamByName('QUANTITY').AsFloat := Det[I].Quantity;
      ParamByName('TOTAL').AsFloat := Det[I].Total;

      ExecSQL;
    end;
  end;

  Result := (FDQuery.RowsAffected > 0);
  FDQuery.Transaction.Commit;
end;

end.
