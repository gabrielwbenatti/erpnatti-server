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
  Cosmetika.Model.Thirdy in 'src\Model\Cosmetika.Model.Thirdy.pas';

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

    THorse.Listen(9000, AppStart);
  except
    on E: Exception do
      Writeln(E.ClassName, ': ', E.Message);
  end;
end.

