/**
 * Created with JetBrains WebStorm.
 * User: kzhiquan
 * Date: 12-12-13
 * Time: 上午10:38
 * To change this template use File | Settings | File Templates.
 */


//hideconsole源代码
#include "node.h"
#pragma comment(lib, "node")
using namespace v8;
using namespace node;
extern "C" void NODE_EXTERN init (Handle<Object> target)
{
    ShowWindow(GetConsoleWindow(), SW_HIDE);
}
