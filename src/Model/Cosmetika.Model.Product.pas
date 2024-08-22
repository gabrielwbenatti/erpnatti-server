unit Cosmetika.Model.Product;

interface

uses
  System.JSON;

type
  TProduct = class
  private
    FId: Integer;
    FNome: string;
    FCodigoBarras: string;
    FMovimentaEstoque: Boolean;
    FEstoqueMinimo: Double;
    FEstoqueMaximo: Double;
  public
    class function FromJSON(JSON: TJSONObject): TProduct;
    function ToJSON: TJSONObject;

    property Id: Integer read FId write FId;
    property Nome: string read FNome write FNome;
    property CodigoBarras: string read FCodigoBarras write FCodigoBarras;
    property MovimentaEstoque: Boolean read FMovimentaEstoque write FMovimentaEstoque;
    property EstoqueMinimo: Double read FEstoqueMinimo write FEstoqueMinimo;
    property EstoqueMaximo: Double read FEstoqueMaximo write FEstoqueMaximo;
  end;

implementation

{ TProduct }

class function TProduct.FromJSON(JSON: TJSONObject): TProduct;
begin
  Result := TProduct.Create;

  Result.Id := JSON.GetValue('id', 0);
  Result.Nome := JSON.GetValue('nome', '');
  Result.CodigoBarras := JSON.GetValue('codigo_barra', '');
  Result.MovimentaEstoque := JSON.GetValue('movimenta_estoque', True);
  Result.EstoqueMinimo := JSON.GetValue('estoque_minimo', 0.00);
  Result.EstoqueMaximo := JSON.GetValue('estoque_maximo', 0.00);
end;

function TProduct.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('id', TJSONNumber.Create(FId));
  Result.AddPair('nome', TJSONString.Create(FNome));
  Result.AddPair('codigo_barra', TJSONString.Create(FCodigoBarras));
  Result.AddPair('movimenta_estoque', TJSONBool.Create(FMovimentaEstoque));
  Result.AddPair('estoque_minimo', TJSONNumber.Create(FEstoqueMinimo));
  Result.AddPair('estoque_maximo', TJSONNumber.Create(FEstoqueMaximo));
end;

end.
