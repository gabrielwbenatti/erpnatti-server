unit Cosmetika.Dao.Product;

interface

uses
  System.SysUtils, System.Classes, Cosmetika.Dao.Generic, FireDAC.Stan.Intf,
  FireDAC.Stan.Option, FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf,
  FireDAC.Stan.Def, FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys,
  FireDAC.ConsoleUI.Wait, FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf,
  FireDAC.DApt, Data.DB, FireDAC.Comp.DataSet, FireDAC.Comp.Client,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, System.JSON, FireDAC.VCLUI.Wait,
  System.Generics.Collections, Cosmetika.Model.Product, FireDAC.Phys.PG,
  FireDAC.Phys.PGDef, System.Variants, Horse.Commons;

type
  TDmProduct = class(TDmGeneric)
  private
    { Private declarations }
  public
    { Public declarations }
    function Destroy(Params: TDictionary<string, string>): Boolean;
    function GetBy(FieldName: string; Value: Variant): TProduct;
    function Index(Query: TDictionary<string, string>): TJSONArray;
    function Show(Params: TDictionary<string, string>): TJSONObject;
    function Store(JSON: TJSONObject): Boolean;
  end;

var
  DmProduct: TDmProduct;

implementation

uses
  Horse.Exception;

{%CLASSGROUP 'System.Classes.TPersistent'}
{$R *.dfm}
{ TDmProduct }

function TDmProduct.Destroy(Params: TDictionary<string, string>): Boolean;
var
  Id: string;
begin
  Params.TryGetValue('id', Id);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;

    SQL.Add(' delete from PRODUCTS ');
    SQL.Add(' where ROWID = :ROWID ');
    ParamByName('ROWID').AsInteger := StrToIntDef(Id, 0);

    ExecSQL;
  end;

  Result := (FDQuery.RowsAffected > 0);

  FDQuery.Transaction.Commit;
end;

function TDmProduct.GetBy(FieldName: string; Value: Variant): TProduct;
begin
  Result := nil;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from PRODUCTS ');
    SQL.Add(' where ' + FieldName + ' = :FIELD_PARAM ');
    ParamByName('FIELD_PARAM').Value := Value;

    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    Result := TProduct.Create;

    Result.Id := FDQuery.FieldByName('id').AsInteger;
    Result.Nome := FDQuery.FieldByName('nome').AsString;
    Result.CodigoBarras := FDQuery.FieldByName('codigo_barra').AsString;
    Result.MovimentaEstoque := FDQuery.FieldByName('movimenta_estoque').AsBoolean;
    Result.EstoqueMinimo := FDQuery.FieldByName('estoque_minimo').AsFloat;
    Result.EstoqueMaximo := FDQuery.FieldByName('estoque_maximo').AsFloat;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmProduct.Index(Query: TDictionary<string, string>): TJSONArray;
var
  Product: TProduct;
  SearchTerm: string;
begin
  Result := TJSONArray.Create;

  Query.TryGetValue('searchTerm', SearchTerm);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from produtos ');

    if not (SearchTerm.Trim.IsEmpty) then
    begin
      SQL.Add(' where ');
      SQL.Add('     (NOME containing(:SEARCH_TERM)) ');
      ParamByName('SEARCH_TERM').AsString := SearchTerm;
    end;

    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    FDQuery.FetchAll;
    FDQuery.First;
    while not FDQuery.Eof do
    begin
      Product := TProduct.Create;
      try
        Product.RowId := FDQuery.FieldByName('id').AsInteger;
        Product.Name := FDQuery.FieldByName('nome').AsString;
        Product.NameAlias := FDQuery.FieldByName('codigo_barra').AsString;
        Product.Reference := FDQuery.FieldByName('movimenta_estoque').AsString;
        Product.Reference := FDQuery.FieldByName('estoque_minimo').AsString;
        Product.Reference := FDQuery.FieldByName('estoque_maximo').AsString;

        Result.Add(Product.ToJSON);
      finally
        Product.Free;
      end;

      FDQuery.Next;
    end;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmProduct.Show(Params: TDictionary<string, string>): TJSONObject;
var
  Id: string;
  Product: TProduct;
begin
  Result := nil;
  Params.TryGetValue('id', Id);
  Product := Self.GetBy('rowid', StrToInt(Id));

  if Assigned(Product) then
    Result := Product.ToJSON;
end;

function TDmProduct.Store(JSON: TJSONObject): Boolean;
var
  Product: TProduct;
begin
  Product := TProduct.FromJSON(JSON);

  if Self.GetBy('reference', Product.Reference) <> nil then
  begin
    raise EHorseException
      .New
      .Error('Reference already exists')
      .Status(THTTPStatus.BadRequest);
  end;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add('insert into');
    SQL.Add('    PRODUCTS (');
    SQL.Add('        REFERENCE,');
    SQL.Add('        NAME,');
    SQL.Add('        NAME_ALIAS,');
    SQL.Add('        STATUS,');
    SQL.Add('        TO_SELL,');
    SQL.Add('        TO_BUY');
    SQL.Add('    )');
    SQL.Add('values');
    SQL.Add('    (');
    SQL.Add('        :REFERENCE,');
    SQL.Add('        :NAME,');
    SQL.Add('        :NAME_ALIAS,');
    SQL.Add('        :STATUS,');
    SQL.Add('        :TO_SELL,');
    SQL.Add('        :TO_BUY');
    SQL.Add('    )');

    ParamByName('REFERENCE').AsString := Product.Reference;
    ParamByName('NAME').AsString := Product.Name;
    ParamByName('NAME_ALIAS').AsString := Product.NameAlias;
    ParamByName('STATUS').AsBoolean := Product.Status;
    ParamByName('TO_SELL').AsBoolean := Product.ToSell;
    ParamByName('TO_BUY').AsBoolean := Product.ToBuy;

    ExecSQL;
  end;

  Result := (FDQuery.RowsAffected > 0);

  FDQuery.Transaction.Commit;
end;

end.
