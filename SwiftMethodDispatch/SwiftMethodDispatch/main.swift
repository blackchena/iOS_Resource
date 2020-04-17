//
//  main.swift
//  SwiftMethodDispatch
//
//  Created by chensiyu on 2020/4/17.
//  Copyright © 2020 Gioneco. All rights reserved.
//

import Foundation

class ParentClass {
    @objc dynamic var kvoTestValue : String?
    @objc func mainMethod() {
        print("\(type(of: self)) \(#function)")
    }
}
extension ParentClass {
    func extensionMethod() {
        print("\(type(of: self)) \(#function)")
    }
}


class ChildClass: ParentClass {
    override func mainMethod() {
        print("\(type(of: self)) \(#function)")
    }

    
//    override func extensionMethod() {
//        print("\(type(of: self)) \(#function)")
//    }
}


let parent = ParentClass()

parent.extensionMethod();

