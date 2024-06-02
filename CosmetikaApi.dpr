program CosmetikaApi;

{$APPTYPE CONSOLE}

{$R *.res}

uses
  System.SysUtils,
  Horse,
  Horse.Jhonson,
  Cosmetika.Utils in 'src\Utils\Cosmetika.Utils.pas',
  Cosmetika.Dao.Generic in 'src\DAO\Cosmetika.Dao.Generic.pas' {DmGeneric: TDataModule},
  Cosmetika.Dao.Product in 'src\DAO\Cosmetika.Dao.Product.pas' {DmProduct: TDataModule},
  Cosmetika.Controller.Product in 'src\Controller\Cosmetika.Controller.Product.pas',
  Cosmetika.Model.Product in 'src\Model\Cosmetika.Model.Product.pas',
  Cosmetika.Dao.Thirdy in 'src\DAO\Cosmetika.Dao.Thirdy.pas' {DmThirdy: TDataModule},
  Cosmetika.Controller.Thirdy in 'src\Controller\Cosmetika.Controller.Thirdy.pas',
  Cosmetika.Model.Thirdy in 'src\Model\Cosmetika.Model.Thirdy.pas',
  Cosmetika.Model.PurchaseInvoice in 'src\Model\Cosmetika.Model.PurchaseInvoice.pas',
  Cosmetika.Controller.PurchaseInvoice in 'src\Controller\Cosmetika.Controller.PurchaseInvoice.pas',
  Cosmetika.Dao.PurchaseInvoice in 'src\DAO\Cosmetika.Dao.PurchaseInvoice.pas' {DmPurchaseInvoice: TDataModule},
  Cosmetika.Model.PurchInvDet in 'src\Model\Cosmetika.Model.PurchInvDet.pas',
  Cosmetika.Dao.PurchInvDet in 'src\DAO\Cosmetika.Dao.PurchInvDet.pas' {DmPurchInvDet: TDataModule};

procedure AppStart;
begin
  Writeln('Server is running on port ' + THorse.Port.ToString);
  Write('Press return to stop...');
  Readln;
  THorse.StopListen;
end;

begin
  try
    THorse.Use(Jhonson);

    TControllerProduct.Registry;
    TControllerThirdy.Registry;
    TControllerPurchaseInvoice.Registry;

    THorse.Listen(9000, AppStart);
  except
    on E: Exception do
      Writeln(E.ClassName, ': ', E.Message);
  end;
end.

