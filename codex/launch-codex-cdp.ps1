Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class AppActivation {
  [ComImport, Guid("45BA127D-10A8-46EA-8AB7-56EA9078943C")]
  class ApplicationActivationManagerClass {}
  [ComImport, InterfaceType(ComInterfaceType.InterfaceIsIInspectable), Guid("2e941141-7f97-4756-ba1d-9decde894a3d")]
  public interface IApplicationActivationManager {
    IntPtr ActivateApplication([In] string appUserModelId, [In] string arguments, [In] int options, [Out] out uint processId);
    IntPtr ActivateForFile([In] string appUserModelId, [In] [MarshalAs(UnmanagedType.IUnknown)] object itemArray, [In] string verb, [Out] out uint processId);
    IntPtr ActivateForProtocol([In] string appUserModelId, [In] [MarshalAs(UnmanagedType.IUnknown)] object itemArray, [Out] out uint processId);
  }
  public static uint Activate(string appUserModelId, string arguments) {
    var mgr = (IApplicationActivationManager)new ApplicationActivationManagerClass();
    uint pid;
    mgr.ActivateApplication(appUserModelId, arguments, 0, out pid);
    return pid;
  }
}
"@
$pid2 = [AppActivation]::Activate('OpenAI.Codex_2p2nqsd0c76g0!App', '--remote-debugging-port=9224')
Write-Output "launched pid=$pid2"
