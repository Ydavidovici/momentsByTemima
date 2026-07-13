$tc = New-Object System.Net.Sockets.TcpClient("momentsbytemima.com", 443)
$ns = $tc.GetStream()
$ssl = New-Object System.Net.Security.SslStream($ns, $false, { $true })
$ssl.AuthenticateAsClient("momentsbytemima.com")
$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($ssl.RemoteCertificate)

Write-Host "Subject: $($cert.Subject)"
Write-Host "Issuer: $($cert.Issuer)"
Write-Host "Not Before: $($cert.NotBefore)"
Write-Host "Not After: $($cert.NotAfter)"
Write-Host "Thumbprint: $($cert.Thumbprint)"

# Print Subject Alternative Names
foreach ($ext in $cert.Extensions) {
    if ($ext.Oid.FriendlyName -eq "Subject Alternative Name") {
        Write-Host "Alternative Names: $($ext.Format($false))"
    }
}

# Check chain
$chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
$chain.ChainPolicy.RevocationMode = [System.Security.Cryptography.X509Certificates.X509RevocationMode]::NoCheck
$isValid = $chain.Build($cert)
Write-Host "Is Chain Valid locally? $isValid"
foreach ($element in $chain.ChainElements) {
    Write-Host "  - Chain Element: $($element.Certificate.Subject) (Issuer: $($element.Certificate.Issuer))"
}

$ssl.Dispose()
$tc.Dispose()
