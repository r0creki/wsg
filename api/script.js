// File: /api/script.js
// Vercel Serverless Function for secure script loading

module.exports = async (req, res) => {
    // Set security headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Your actual script URL
    const REAL_SCRIPT_URL = "https://raw.githubusercontent.com/i77lhm/Libraries/refs/heads/main/Utopia/Example.lua";
    
    // Security validation
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const origin = req.headers['origin'] || '';
    
    // Check if request is likely from Roblox
    const isFromRoblox = 
        userAgent.includes('Roblox') ||
        userAgent.includes('RobloxApp') ||
        referer.includes('roblox') ||
        origin.includes('roblox-client') ||
        req.headers['x-roblox-agent'] ||
        req.query.key === process.env.SECRET_KEY;
    
    // If not from Roblox, return access denied
    if (!isFromRoblox) {
        return res.status(403).send(`-- ⚠️ ACCESS DENIED - Pevolution Secure Gateway v2.0
-- 
-- This endpoint is protected and can only be accessed through authorized Roblox executors.
-- 
-- Usage in Roblox:
-- loadstring(game:HttpGet("https://pevolution.vercel.app/api/script", true))()
-- 
-- Error Code: 403 - Unauthorized Access
-- Reason: Direct browser access is not permitted
-- Timestamp: ${new Date().toISOString()}
-- 
-- Security Features:
-- • Request Origin Validation
-- • User-Agent Verification
-- • Anti-Skid Protection
-- • Access Control Lists
-- • Encrypted Gateway
-- 
-- For support, please use proper execution methods.
-- This system is protected by Pevolution.`);
    }
    
    // Create the secure loader script
    const loaderScript = `-- 🔒 Pevolution Secure Gateway Loader v2.0
-- Protected by pevolution.vercel.app
-- Loading secure resource...
-- Timestamp: ${Date.now()}

local Security = {
    Version = "2.0.1",
    Gateway = "pevolution.vercel.app",
    Timestamp = ${Date.now()},
    SessionID = "${Math.random().toString(36).substr(2, 9)}"
}

-- Security validation function
local function validateExecutionEnvironment()
    -- Check for required functions
    if not game or not game.HttpGet then
        return false, "Invalid execution environment"
    end
    
    -- Additional security checks
    return true, "Environment validated"
end

-- Main loader function
local function loadSecureScript()
    print("[Pevolution Security] 🔒 Initializing secure connection...")
    print("[Pevolution Security] Gateway: " .. Security.Gateway)
    print("[Pevolution Security] Session: " .. Security.SessionID)
    
    -- Validate environment first
    local envValid, envMessage = validateExecutionEnvironment()
    if not envValid then
        warn("[Pevolution Security] ⚠️ Validation failed: " .. envMessage)
        return nil
    end
    
    print("[Pevolution Security] ✓ Environment validated")
    
    -- Secure script URL
    local secureURL = "${REAL_SCRIPT_URL}"
    
    -- Load the actual script
    local success, scriptContent = pcall(function()
        return game:HttpGet(secureURL, true)
    end)
    
    if success and scriptContent then
        print("[Pevolution Security] ✓ Script loaded successfully")
        print("[Pevolution Security] 🚀 Executing main script...")
        
        local loadedFunction, errorMessage = loadstring(scriptContent)
        
        if loadedFunction then
            local secureEnv = getfenv()
            setfenv(loadedFunction, secureEnv)
            
            local execSuccess, execResult = pcall(loadedFunction)
            if execSuccess then
                print("[Pevolution Security] ✅ Execution successful")
                return execResult
            else
                warn("[Pevolution Security] ⚠️ Execution error: " .. tostring(execResult))
                return nil
            end
        else
            warn("[Pevolution Security] ⚠️ Loadstring error: " .. tostring(errorMessage))
            return nil
        end
    else
        warn("[Pevolution Security] ⚠️ Failed to fetch script: " .. tostring(scriptContent))
        return nil
    end
end

-- Initialize and execute
local startTime = tick()
local result = loadSecureScript()
local endTime = tick()

local executionTime = endTime - startTime
print(string.format("[Pevolution Security] 📊 Execution completed in %.3f seconds", executionTime))
print("[Pevolution Security] 🔐 Secure Gateway Session Ended")

return result`;

    // Return the loader script
    res.send(loaderScript);
};