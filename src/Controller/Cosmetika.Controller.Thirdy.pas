unit Cosmetika.Controller.Thirdy;

interface

uses Horse;

type
  TControllerThirdy = class
  private
    class procedure DoIndex(Req: THorseRequest; Res: THorseResponse);
    class procedure DoPost(Req: THorseRequest; Res: THorseResponse);
  public
    class procedure Registry;
  end;

implementation

uses
  Cosmetika.Dao.Thirdy, System.JSON;

{ TControllerThirdy }

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

class procedure TControllerThirdy.DoPost(Req: THorseRequest;
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

class procedure TControllerThirdy.Registry;
begin
  THorse.Get('/thirdies', DoIndex);
  THorse.Post('/thirdies', DoPost);
end;

end.
