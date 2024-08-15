unit Cosmetika.Controller.Thirdy;

interface

uses
  Horse;

type
  TControllerThirdy = class
  private
    class procedure DoDestroy(Req: THorseRequest; Res: THorseResponse);
    class procedure DoIndex(Req: THorseRequest; Res: THorseResponse);
    class procedure DoStore(Req: THorseRequest; Res: THorseResponse);
    class procedure DoShow(Req: THorseRequest; Res: THorseResponse);
  public
    class procedure Registry;
  end;

implementation

uses
  Cosmetika.Dao.Thirdy, System.JSON;

{ TControllerThirdy }

class procedure TControllerThirdy.DoDestroy(Req: THorseRequest;
  Res: THorseResponse);
begin
  raise EHorseException.New.Error('Em desenvolvimento').Status(THTTPStatus.NotImplemented)
end;

class procedure TControllerThirdy.DoIndex(Req: THorseRequest;
  Res: THorseResponse);
var
  ThirdyDao: TDmThirdy;
  JsonArray: TJSONArray;
begin
  ThirdyDao := TDmThirdy.Create;
  try
    JsonArray := ThirdyDao.Index(Req.Query.Dictionary);
    Res.Send<TJSONArray>(JsonArray).Status(THTTPStatus.OK);
  finally
    ThirdyDao.Free;
  end;
end;

class procedure TControllerThirdy.DoStore(Req: THorseRequest;
  Res: THorseResponse);
var
  ThirdyDao: TDmThirdy;
begin
  ThirdyDao := TDmThirdy.Create;
  try
    if ThirdyDao.Store(Req.Body<TJSONObject>) then
      Res.Status(THTTPStatus.Created)
    else
      Res.Status(THTTPStatus.BadRequest);
  finally
    ThirdyDao.Free;
  end;
end;

class procedure TControllerThirdy.DoShow(Req: THorseRequest;
  Res: THorseResponse);
var
  ThirdyDao: TDmThirdy;
  JsonObj: TJSONObject;
begin
  ThirdyDao := TDmThirdy.Create;
  try
    JsonObj := ThirdyDao.Show(Req.Params.Dictionary);
    if Assigned(JsonObj) then
      Res.Send<TJSONObject>(JsonObj).Status(THTTPStatus.OK)
    else
      Res.Status(THTTPStatus.NoContent);
  finally
    ThirdyDao.Free;
  end;
end;

class procedure TControllerThirdy.Registry;
begin
  THorse.Get('/thirdies', DoIndex);
  THorse.Post('/thirdies', DoStore);
  THorse.Get('/thirdies/:id', DoShow);
  THorse.Delete('/thirdies/:id', DoDestroy);
end;

end.
