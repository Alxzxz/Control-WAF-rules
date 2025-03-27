### BANNED FRONT-IP


rule {
    action   = "deny(403)"
    preview  = false
    priority = 999

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('sqli-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id942230-sqli', 'owasp-crs-v030301-id942100-sqli', 'owasp-crs-v030301-id942190-sqli']}) ||
          evaluatePreconfiguredWaf('lfi-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('rce-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id932110-rce', 'owasp-crs-v030301-id932150-rce', 'owasp-crs-v030301-id932115-rce']})
        EOT
      }
    }

    preconfigured_waf_config {
      exclusion {
        target_rule_set = "sqli-v33-stable"
        target_rule_ids = ["owasp-crs-v030301-id942140-sqli", "owasp-crs-v030301-id942220-sqli"]
        request_cookie {
          operator = "EQUALS_ANY"
        }
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = false
    priority = 1000

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rfi-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('xss-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id941120-xss','owasp-crs-v030301-id941130-xss','owasp-crs-v030301-id941100-xss']})
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = false
    priority = 1001

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('scannerdetection-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('methodenforcement-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('protocolattack-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id921110-protocolattack','owasp-crs-v030301-id921150-protocolattack', 'owasp-crs-v030301-id921120-protocolattack']}) ||
          evaluatePreconfiguredWaf('php-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id933180-php', 'owasp-crs-v030301-id933210-php']}) ||
          evaluatePreconfiguredWaf('sessionfixation-v33-stable', {'sensitivity': 1})
        EOT
      }
    }
  }






























  

  ## ANALYZE IF THE RULES TRADEINN HAVENT CHECK WOULD HAVE STOP AN ATTACK
  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1002

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('sqli-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id942230-sqli', 'owasp-crs-v030301-id942100-sqli']})
        EOT
      }
    }
    preconfigured_waf_config {
      exclusion {
        target_rule_set = "sqli-v33-stable"
        target_rule_ids = ["owasp-crs-v030301-id942140-sqli"]
        request_cookie {
          operator = "EQUALS_ANY"
        }
      }
    }
  }


  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1003

    match {
      expr {
        expression = <<-EOT
        evaluatePreconfiguredWaf('xss-v33-stable', {'sensitivity': 1, 'opt_out_rule_ids': ['owasp-crs-v030301-id941120-xss']})
        EOT
      }
    }
    preconfigured_waf_config {
      exclusion {
        request_cookie {
          operator = "EQUALS_ANY"
        }
        target_rule_set = "xss-v33-stable"
        target_rule_ids = ["owasp-crs-v030301-id941100-xss", "owasp-crs-v030301-id941130-xss"]
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1004

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rce-v33-stable', {'sensitivity': 1})
        EOT
      }
    }
    preconfigured_waf_config {
      exclusion {
        request_cookie {
          operator = "EQUALS_ANY"
        }
        target_rule_set = "rce-v33-stable"
        target_rule_ids = ["owasp-crs-v030301-id932150-rce"]
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1005

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('protocolattack-v33-stable', {'sensitivity': 1})
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1006

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('php-v33-stable', {'sensitivity': 1})
        EOT
      }
    }
  }



### BANNED-WAF


  rule {
    action   = "deny(403)"
    preview  = true
    priority = 999

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('scannerdetection-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredExpr('methodenforcement-v33-stable') ||
          evaluatePreconfiguredWaf('protocolattack-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('php-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('php-v33-stable', {'sensitivity': 1})
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1000

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('sqli-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('lfi-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('rce-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('rfi-v33-stable', {'sensitivity': 1}) ||
          evaluatePreconfiguredWaf('xss-v33-stable', {'sensitivity': 1}) 
        EOT
      }
    }

    preconfigured_waf_config {
      exclusion {
        target_rule_set = "sqli-v33-stable"
        target_rule_ids = ["owasp-crs-v030301-id942140-sqli"]
        request_cookie {
          operator = "CONTAINS"
          value    = "rurl"
        }
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1001

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredExpr('sessionfixation-v33-stable')
        EOT
      }
    }
  }



## ELASTIC CLUSTER WEB


  rule {
    action   = "deny(403)"
    preview  = true
    priority = 102

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredExpr('sqli-v33-stable', [
            'owasp-crs-v030302-id942200-sqli',
            'owasp-crs-v030301-id942260-sqli',
            'owasp-crs-v030301-id942370-sqli',
            'owasp-crs-v030301-id942430-sqli',
            'owasp-crs-v030301-id942431-sqli',
            'owasp-crs-v030301-id942432-sqli',
            'owasp-crs-v030301-id942460-sqli',
            'owasp-crs-v030301-id942490-sqli',
            'owasp-crs-v030301-id942330-sqli',
            'owasp-crs-v030301-id942340-sqli',
            'owasp-crs-v030301-id942130-sqli'
            ])
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 103

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('xss-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 104

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('lfi-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 105

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rfi-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 106

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rce-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 107

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('methodenforcement-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 108

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('scannerdetection-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 109

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredExpr('protocolattack-v33-stable', [
            'owasp-crs-v030301-id921151-protocolattack'
          ])
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 110

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('php-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 111

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('sessionfixation-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 112

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('java-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 113

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('nodejs-v33-stable')
        EOT
      }
    }
  }

    rule {
    action   = "deny(403)"
    preview  = true
    priority = 1002

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredExpr('sqli-v33-stable', [
            'owasp-crs-v030301-id942200-sqli',
            'owasp-crs-v030301-id942260-sqli',
            'owasp-crs-v030301-id942370-sqli',
            'owasp-crs-v030301-id942430-sqli',
            'owasp-crs-v030301-id942431-sqli',
            'owasp-crs-v030301-id942432-sqli',
            'owasp-crs-v030301-id942460-sqli',
            'owasp-crs-v030301-id942490-sqli',
            'owasp-crs-v030301-id942330-sqli',
            'owasp-crs-v030301-id942340-sqli',
            'owasp-crs-v030301-id942130-sqli',
            'owasp-crs-v030301-id942110-sqli'
            ])
        EOT
      }
    }
  }


  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1003

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('xss-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1004

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('lfi-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1005

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rfi-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1006

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('rce-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1007

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('methodenforcement-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1008

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('scannerdetection-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1009

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredExpr('protocolattack-v33-stable', [
            'owasp-crs-v030301-id921151-protocolattack'
          ])
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1010

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('php-v33-stable', {'sensitivity': 1,'opt_out_rule_ids': ['owasp-crs-v030301-id933151-php']})
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1011

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('sessionfixation-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1012

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('java-v33-stable')
        EOT
      }
    }
  }

  rule {
    action   = "deny(403)"
    preview  = true
    priority = 1013

    match {
      expr {
        expression = <<-EOT
          evaluatePreconfiguredWaf('nodejs-v33-stable')
        EOT
      }
    }
  }
